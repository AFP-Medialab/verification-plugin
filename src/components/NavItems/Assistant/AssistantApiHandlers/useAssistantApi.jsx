import axios from "axios";

export default function assistantApiCalls() {
  const assistantEndpoint = process.env.REACT_APP_ASSISTANT_URL;

  function handleAssistantError(errorResponse) {
    if (errorResponse.response) {
      // If there is a response then it's some kind of server error
      if (errorResponse.response.data && errorResponse.response.data.message)
        console.log(
          "Assistant error:",
          "Bad HTTP status " + errorResponse.response.status + ":",
          errorResponse.response.data.message,
        );
      throw new Error("assistant_error_server_error");
    } else if (errorResponse.request) {
      // Connection issues if no response object
      throw new Error("assistant_error_connection_error");
    } else {
      // Unexpected error
      throw new Error("assistant_error");
    }
  }

  const callAssistantScraper = async (urlType, userInput) => {
    let scrapeResult;
    try {
      scrapeResult = await axios.get(
        assistantEndpoint +
          "scrape/" +
          urlType +
          "?url=" +
          encodeURIComponent(userInput),
      );
    } catch (error) {
      handleAssistantError(error);
    }

    if (scrapeResult.data.status === "success") {
      return scrapeResult.data;
    } else {
      console.log("Assistant error:", scrapeResult.data.message);
      throw new Error("assistant_error_server_error");
    }
  };

  const callNamedEntityService = async (text, lang) => {
    try {
      const namedEntityResult = await axios.post(
        assistantEndpoint + "gcloud/named-entity",
        {
          content: text,
          lang: lang,
        },
      );
      const concepts = new Set(
        namedEntityResult.data.entities.Unclassified.map(
          (e) => "wd:" + e.concept,
        ),
      );
      const dbpedia = `http://${lang == "en" ? "" : "en."}dbpedia.org`;
      const wdQuery = `
      SELECT (REPLACE(STR(?concept), "http://www.wikidata.org/entity/", "") AS ?conceptID)
      (REPLACE(STR(?article), "https://${lang}.wikipedia.org/wiki/", "${dbpedia}/page/") AS ?link)
      (REPLACE(STR(?article), "https://${lang}.wikipedia.org/wiki/", "${dbpedia}/resource/") AS ?iri)
      ?title
      WHERE {
        VALUES ?concept { ${[...concepts].join(" ")} }
        ?article schema:about ?concept .
        ?article schema:isPartOf <https://${lang}.wikipedia.org/> .
        ?article schema:name ?title .
      }`;
      const mappingResult = await axios.get(
        `https://query.wikidata.org/sparql?format=json&query=${encodeURIComponent(wdQuery)}`,
      );
      const mapping = {};
      for (const entity of mappingResult.data.results.bindings) {
        mapping["<" + entity.iri.value + ">"] = {
          concept: entity.conceptID.value,
          title: entity.title.value,
          link: entity.link.value,
        };
      }
      const iris = Object.keys(mapping);
      let dbpediaResultBindings = [];
      const chunkSize = 25;
      for (let i = 0; i < iris.length; i += chunkSize) {
        const chunk = iris.slice(i, i + chunkSize);
        const dbQuery = `
          SELECT ?iri (GROUP_CONCAT(DISTINCT ?type; SEPARATOR = ",") AS ?schemaTypes)
          WHERE {
            VALUES ?iri { ${chunk.join(" ")} }
            ?iri rdf:type ?type .
          }`;
        const dbpediaEndpoint = process.env.REACT_APP_DBPEDIA_SPARQL_URL;
        const dbpediaResult = await axios.get(
          `${dbpediaEndpoint}?query=${encodeURIComponent(dbQuery)}&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on`,
        );
        dbpediaResultBindings = dbpediaResultBindings.concat(
          dbpediaResult.data.results.bindings,
        );
      }
      for (const entity of dbpediaResultBindings) {
        mapping["<" + entity.iri.value + ">"]["abstract"] =
          entity.abstract?.value || "";
        mapping["<" + entity.iri.value + ">"]["schemaTypes"] =
          entity.schemaTypes.value.split(",");
      }

      const features = Object.values(mapping).reduce((acc, obj) => {
        acc[obj.concept] = obj;
        return acc;
      }, {});

      const entities = { Person: [], Location: [], Organization: [] };
      for (const entity of namedEntityResult.data.entities.Unclassified) {
        entity.features = {
          ...entity.features,
          ...features[entity.concept],
        };
        entity.features.originalText = entity.string;
        entity.features.string = entity.features.title;
        delete entity.features["title"];
        if (
          new Set(entity.features.schemaTypes).intersection(
            new Set([
              "http://schema.org/Location",
              "http://dbpedia.org/ontology/Location",
            ]),
          ).size > 0
        ) {
          entities["Location"].push(entity);
        } else if (
          new Set(entity.features.schemaTypes).intersection(
            new Set([
              "http://schema.org/Organization",
              "http://dbpedia.org/ontology/Organisation",
            ]),
          ).size > 0
        ) {
          entities["Organization"].push(entity);
        } else if (
          new Set(entity.features.schemaTypes).intersection(
            new Set([
              "http://schema.org/Person",
              "http://dbpedia.org/ontology/Person",
            ]),
          ).size > 0
        ) {
          entities["Person"].push(entity);
        }
      }
      namedEntityResult.data.entities = entities;

      return namedEntityResult.data;
    } catch (error) {
      console.log("ERROR", error);
    }
  };

  const callOcrService = async (data, script, mode) => {
    const result = await axios.post(assistantEndpoint + "gcloud/ocr", {
      text: data,
      script: script,
      data_type: mode,
    });

    return result.data;
  };

  const MAX_NUM_RETRIES = 3;

  /**
   * Calls an async function that throws an exception when it fails, will retry for numMaxRetries
   * @param numMaxRetries Number of times the function will be retried
   * @param asyncFunc The async function to call
   * @param errorFunc Called when asyncFunc throws an error when there are additional retries
   * @returns {Promise<*>} Output of asyncFunc
   */
  async function callAsyncWithNumRetries(
    numMaxRetries,
    asyncFunc,
    errorFunc = null,
  ) {
    for (let retryCount = 0; retryCount < numMaxRetries; retryCount++) {
      try {
        return await asyncFunc();
      } catch (e) {
        if (retryCount + 1 >= MAX_NUM_RETRIES) {
          throw e;
        } else {
          if (errorFunc) errorFunc(retryCount, e);
        }
      }
    }
  }

  const callSourceCredibilityService = async (urlList) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        if (urlList.length === 0) return null;

        const result = await axios.post(
          assistantEndpoint + "gcloud/source-credibility",
          {
            urls: urlList,
            frontendVersion: "0.88",
          },
        );
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to source credibility service, tries " +
            (numTries + 1) +
            "/" +
            MAX_NUM_RETRIES,
        );
      },
    );
  };

  const callNewsFramingService = async (text) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        const result = await axios.post(
          assistantEndpoint + "gcloud/news-framing-clfr",
          { text: text },
        );
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to news framing service, tries " +
            (numTries + 1) +
            "/" +
            MAX_NUM_RETRIES,
        );
      },
    );
  };

  const callNewsGenreService = async (text) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        const result = await axios.post(
          assistantEndpoint + "gcloud/news-genre-clfr",
          { text: text },
        );
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to news genre service, tries " +
            (numTries + 1) +
            "/" +
            MAX_NUM_RETRIES,
        );
      },
    );
  };

  const callPersuasionService = async (text) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        const result = await axios.post(
          assistantEndpoint + "gcloud/persuasion-span-clfr",
          {
            text: text,
          },
        );
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to persuasion service, tries " +
            (numTries + 1) +
            "/" +
            MAX_NUM_RETRIES,
        );
      },
    );
  };

  const callSubjectivityService = async (text) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        const result = await axios.post(assistantEndpoint + "dw/subjectivity", {
          content: text,
        });
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to subjectivity service, tries " +
            (numTries + 1) +
            "/" +
            MAX_NUM_RETRIES,
        );
      },
    );
  };

  const callPrevFactChecksService = async (text) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        const result = await axios.post(
          assistantEndpoint + "kinit/prev-fact-checks",
          {
            content: text,
          },
        );
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to previous fact checks service, tries " +
            (numTries + 1) +
            "/" +
            MAX_NUM_RETRIES,
        );
      },
    );
  };

  const callMachineGeneratedTextChunksService = async (text) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        const result = await axios.post(
          assistantEndpoint + "kinit/machine-generated-text-chunks",
          {
            content: text,
          },
        );
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to machine generated text service for chunks, tries " +
            (numTries + 1) +
            "/" +
            MAX_NUM_RETRIES,
        );
      },
    );
  };

  const callMachineGeneratedTextSentencesService = async (text) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        const result = await axios.post(
          assistantEndpoint + "kinit/machine-generated-text-sentences",
          {
            content: text,
          },
        );
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to machine generated text service for sentences, tries " +
            (numTries + 1) +
            "/" +
            MAX_NUM_RETRIES,
        );
      },
    );
  };

  const callMultilingualStanceService = async (comments) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        const result = await axios.post(
          assistantEndpoint + "gcloud/multilingual-stance-classification",
          {
            comments: comments,
          },
        );
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to multilingual stance service, tries " +
            (numTries + 1) +
            "/" +
            MAX_NUM_RETRIES,
        );
      },
    );
  };

  return {
    callAssistantScraper,
    callSourceCredibilityService,
    callNamedEntityService,
    callOcrService,
    callNewsFramingService,
    callNewsGenreService,
    callPersuasionService,
    callSubjectivityService,
    callPrevFactChecksService,
    callMachineGeneratedTextChunksService,
    callMachineGeneratedTextSentencesService,
    callMultilingualStanceService,
  };
}

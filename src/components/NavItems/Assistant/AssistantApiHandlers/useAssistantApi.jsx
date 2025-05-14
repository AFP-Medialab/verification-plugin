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
        namedEntityResult.data.response.annotations.Unclassified.map(
          (e) => "wd:" + e.features.concept,
        ),
      );
      const wdQuery = `
      SELECT (REPLACE(STR(?concept), "http://www.wikidata.org/entity/", "") AS ?conceptID)
      (REPLACE(STR(?article), "https://en.wikipedia.org/wiki/", "http://dbpedia.org/page/") AS ?link)
      (REPLACE(STR(?article), "https://en.wikipedia.org/wiki/", "http://dbpedia.org/resource/") AS ?iri)
      ?title
      WHERE {
        VALUES ?concept { ${[...concepts].join(" ")} }
        ?article schema:about ?concept .
        ?article schema:isPartOf <https://en.wikipedia.org/> .
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
      const dbQuery = `
      SELECT ?iri ?abstract (GROUP_CONCAT(DISTINCT ?type; SEPARATOR = ",") AS ?schemaTypes)
      WHERE {
        VALUES ?iri { ${Object.keys(mapping).join(" ")} }
        ?iri dbo:abstract ?abstract .
        ?iri rdf:type ?type .
        FILTER (lang(?abstract) = "en")
      }`;
      const dbpediaResult = await axios.get(
        `https://dbpedia.org/sparql?query=${encodeURIComponent(dbQuery)}&format=application%2Fsparql-results%2Bjson&timeout=30000&signal_void=on&signal_unconnected=on`,
      );
      for (const entity of dbpediaResult.data.results.bindings) {
        mapping["<" + entity.iri.value + ">"]["abstract"] =
          entity.abstract.value;
        mapping["<" + entity.iri.value + ">"]["schemaTypes"] =
          entity.schemaTypes.value.split(",");
      }

      const features = Object.values(mapping).reduce((acc, obj) => {
        acc[obj.concept] = obj;
        return acc;
      }, {});

      const entities = { Person: [], Location: [], Organization: [] };
      for (const entity of namedEntityResult.data.response.annotations
        .Unclassified) {
        entity.features = {
          ...entity.features,
          ...features[entity.features.concept],
        };
        entity.features.originalText = entity.features.string;
        entity.features.string = entity.features.title;
        delete entity.features["title"];
        if (
          new Set(entity.features.schemaTypes).intersection(
            new Set([
              "http://schema.org/Person",
              "http://dbpedia.org/ontology/Person",
            ]),
          ).size > 0
        ) {
          entities["Person"].push(entity);
        }
        if (
          new Set(entity.features.schemaTypes).intersection(
            new Set([
              "http://schema.org/Location",
              "http://dbpedia.org/ontology/Location",
            ]),
          ).size > 0
        ) {
          entities["Location"].push(entity);
        }
        if (
          new Set(entity.features.schemaTypes).intersection(
            new Set([
              "http://schema.org/Organization",
              "http://dbpedia.org/ontology/Organisation",
            ]),
          ).size > 0
        ) {
          entities["Organization"].push(entity);
        }
      }
      namedEntityResult.data.response.annotations = entities;

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

        let urls = urlList.join(" ");

        const result = await axios.post(
          assistantEndpoint + "gcloud/source-credibility",
          { text: urls },
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
          { text: text },
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
          "Could not connect to previous fact checks service, tries " +
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
        const result = await axios.get(
          assistantEndpoint +
            "kinit/prev-fact-checks" +
            "?text=" +
            encodeURIComponent(text), // max URL length is 2048 characters
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

  const callMachineGeneratedTextService = async (text) => {
    return await callAsyncWithNumRetries(
      MAX_NUM_RETRIES,
      async () => {
        const result = await axios.post(
          assistantEndpoint + "kinit/machine-generated-text",
          {
            content: text,
          },
        );
        return result.data;
      },
      (numTries) => {
        console.log(
          "Could not connect to machine generated text service, tries " +
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
    callMachineGeneratedTextService,
    callMultilingualStanceService,
  };
}

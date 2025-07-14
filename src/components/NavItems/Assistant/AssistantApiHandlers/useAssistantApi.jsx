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
    const namedEntityResult = await axios.post(
      assistantEndpoint + "gcloud/named-entity",
      {
        content: text,
        lang: lang,
      },
    );

    return namedEntityResult.data;
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
          {
            text: text,
            frontendVersion: 0.87,
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
          frontendVersion: 0.87,
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

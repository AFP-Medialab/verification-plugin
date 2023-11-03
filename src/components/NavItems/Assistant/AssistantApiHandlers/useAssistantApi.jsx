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
      { content: text, lang: lang },
    );

    return namedEntityResult.data;
  };

  const callSourceCredibilityService = async (urlList) => {
    if (urlList.length === 0) return null;

    let urls = urlList.join(" ");

    const result = await axios.post(
      assistantEndpoint + "gcloud/source-credibility",
      { text: urls },
    );

    return result.data;
  };

  const callOcrService = async (data, script, mode) => {
    const result = await axios.post(assistantEndpoint + "gcloud/ocr", {
      text: data,
      script: script,
      data_type: mode,
    });

    return result.data;
  };

  const callNewsFramingService = async (text) => {
    const result = await axios.post(
      assistantEndpoint + "gcloud/news-framing-clfr",
      { text: text }
    );
    return result.data;
  };

  const callNewsGenreService = async (text) => {
    const result = await axios.post(
      assistantEndpoint + "gcloud/news-genre-clfr",
      { text: text }
    );
    return result.data;
  };

  const callPersuasionService = async (text) => {
    const result = await axios.post(
      assistantEndpoint + "gcloud/persuasion-clfr",
      { text: text }
    );
    return result.data;
  };

  const callOcrScriptService = async () => {
    const result = await axios.get(assistantEndpoint + "gcloud/ocr-scripts");
    return result.data;
  };

  return {
    callAssistantScraper,
    callSourceCredibilityService,
    callNamedEntityService,
    callOcrService,
    callOcrScriptService,
    callNewsFramingService,
    callNewsGenreService,
    callPersuasionService,
  };
}

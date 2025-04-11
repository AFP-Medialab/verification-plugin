import isEqual from "lodash/isEqual";
import uniqWith from "lodash/uniqWith";
import {
  all,
  call,
  fork,
  put,
  select,
  take,
  takeLatest,
} from "redux-saga/effects";

import assistantApiCalls from "../../components/NavItems/Assistant/AssistantApiHandlers/useAssistantApi";
import DBKFApi from "../../components/NavItems/Assistant/AssistantApiHandlers/useDBKFApi";
import {
  CONTENT_TYPE,
  KNOWN_LINKS,
  KNOWN_LINK_PATTERNS,
  NE_SUPPORTED_LANGS,
  TYPE_PATTERNS,
  matchPattern,
  selectCorrectActions,
} from "../../components/NavItems/Assistant/AssistantRuleBook";
import {
  cleanAssistantState,
  setAssistantLoading,
  setDbkfImageMatchDetails,
  setDbkfTextMatchDetails,
  setDbkfVideoMatchDetails,
  setErrorKey,
  setImageVideoSelected,
  setInputSourceCredDetails,
  setInputUrl,
  setMachineGeneratedTextChunksDetails,
  setMachineGeneratedTextSentencesDetails,
  setMissingMedia,
  setMultilingualStanceDetails,
  setNeDetails,
  setNewsGenreDetails,
  setNewsTopicDetails,
  setPersuasionDetails,
  setPrevFactChecksDetails,
  setProcessUrl,
  setProcessUrlActions,
  setScrapedData,
  setSingleMediaPresent,
  setSubjectivityDetails,
  setUrlMode,
} from "../actions/tools/assistantActions";

/**
 * APIs
 **/
const dbkfAPI = DBKFApi();
const assistantApi = assistantApiCalls();

/**
 * WATCHERS
 **/
function* getUploadSaga() {
  yield takeLatest("SUBMIT_UPLOAD", handleSubmitUpload);
}

function* getMediaListSaga() {
  yield takeLatest("SET_SCRAPED_DATA", handleMediaLists);
}

function* getMediaActionSaga() {
  yield takeLatest(
    ["SET_PROCESS_URL", "AUTH_USER_LOGIN", "AUTH_USER_LOGOUT"],
    handleMediaActionList,
  );
}

function* getAssistantScrapeSaga() {
  yield takeLatest("SUBMIT_INPUT_URL", handleAssistantScrapeCall);
}

function* getMediaSimilaritySaga() {
  yield takeLatest(
    ["SET_PROCESS_URL", "CLEAN_STATE"],
    handleMediaSimilarityCall,
  );
}

function* getDbkfTextMatchSaga() {
  yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleDbkfTextCall);
}

function* getNewsTopicSaga() {
  yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleNewsTopicCall);
}

function* getNewsGenreSaga() {
  yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleNewsGenreCall);
}

function* getPersuasionSaga() {
  yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handlePersuasionCall);
}

function* getSourceCredSaga() {
  yield takeLatest(
    ["SET_INPUT_URL", "CLEAN_STATE"],
    handleSourceCredibilityCall,
  );
}

function* getNamedEntitySaga() {
  yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleNamedEntityCall);
}

function* getSubjectivitySaga() {
  yield takeLatest(["SET_SCRAPED_DATA", "CLEAN_STATE"], handleSubjectivityCall);
}

function* getPrevFactChecksSaga() {
  yield takeLatest(
    ["SET_SCRAPED_DATA", "AUTH_USER_LOGIN", "CLEAN_STATE"],
    handlePrevFactChecksCall,
  );
}

function* getMachineGeneratedTextChunksSaga() {
  yield takeLatest(
    ["SET_SCRAPED_DATA", "AUTH_USER_LOGIN", "CLEAN_STATE"],
    handleMachineGeneratedTextChunksCall,
  );
}

function* getMachineGeneratedTextSentencesSaga() {
  yield takeLatest(
    ["SET_SCRAPED_DATA", "AUTH_USER_LOGIN", "CLEAN_STATE"],
    handleMachineGeneratedTextSentencesCall,
  );
}

function* getMultilingualStanceSaga() {
  yield takeLatest(
    ["SET_SCRAPED_DATA", "CLEAN_STATE"],
    handleMultilingualStanceCall,
  );
}

/**
 * NON-API HANDLERS
 **/
function* handleMediaLists() {
  const imageList = yield select((state) => state.assistant.imageList);
  const videoList = yield select((state) => state.assistant.videoList);

  if (imageList.length === 1 && videoList.length === 0) {
    yield put(setProcessUrl(imageList[0], CONTENT_TYPE.IMAGE));
    yield put(setSingleMediaPresent(true));
  } else if (videoList.length === 1 && imageList.length === 0) {
    yield put(setProcessUrl(videoList[0], CONTENT_TYPE.VIDEO));
    yield put(setSingleMediaPresent(true));
  }
}

function* handleMediaActionList() {
  const inputUrl = yield select((state) => state.assistant.inputUrl);
  const processUrl = yield select((state) => state.assistant.processUrl);
  const contentType = yield select((state) => state.assistant.processUrlType);
  const role = yield select((state) => state.userSession.user.roles);

  if (processUrl !== null) {
    let knownInputLink = yield call(
      matchPattern,
      inputUrl,
      KNOWN_LINK_PATTERNS,
    );
    let knownProcessLink = yield call(
      matchPattern,
      processUrl,
      KNOWN_LINK_PATTERNS,
    );
    let actions = yield call(
      selectCorrectActions,
      contentType,
      knownInputLink,
      knownProcessLink,
      processUrl,
      role,
    );

    yield put(setProcessUrlActions(contentType, actions));
  }
}

function* handleSubmitUpload(action) {
  let contentType = action.payload.contentType;
  let known_link = KNOWN_LINKS.OWN;
  const role = yield select((state) => state.userSession.user.roles);
  let actions = selectCorrectActions(
    contentType,
    known_link,
    known_link,
    "",
    role,
  );
  yield put(setProcessUrlActions(contentType, actions));
  yield put(setImageVideoSelected(true));
}

/**
 * API HANDLERS
 **/
function* handleMediaSimilarityCall(action) {
  if (action.type === "CLEAN_STATE") return;

  const inputUrlType = yield select((state) => state.assistant.inputUrlType);
  const processUrl = yield select((state) => state.assistant.processUrl);
  const contentType = yield select((state) => state.assistant.processUrlType);
  const unprocessbleTypes = [
    KNOWN_LINKS.YOUTUBE,
    KNOWN_LINKS.VIMEO,
    KNOWN_LINKS.LIVELEAK,
    KNOWN_LINKS.DAILYMOTION,
  ];

  if (contentType === CONTENT_TYPE.IMAGE) {
    yield call(
      similaritySearch,
      () => dbkfAPI.callImageSimilarityEndpoint(processUrl),
      (result, loading, done, fail) =>
        setDbkfImageMatchDetails(result, loading, done, fail),
    );
  } else if (
    contentType === CONTENT_TYPE.VIDEO &&
    !unprocessbleTypes.includes(inputUrlType)
  ) {
    yield call(
      similaritySearch,
      () => dbkfAPI.callVideoSimilarityEndpoint(processUrl),
      (result, loading, done, fail) =>
        setDbkfVideoMatchDetails(result, loading, done, fail),
    );
  }
}

function* similaritySearch(searchEndpoint, stateStorageFunction) {
  yield put(stateStorageFunction(null, true, false, false));

  try {
    let result = yield call(searchEndpoint);
    if (Object.keys(result).length) {
      let similarityResult = result;
      let resultList = [];
      Object.keys(similarityResult).forEach((key) => {
        result[key].appearancesResults.forEach((appearance) => {
          resultList.push({
            claimUrl: result[key].externalLink,
            similarity: appearance.similarity,
          });
        });
        result[key].evidencesResults.forEach((evidence) => {
          resultList.push({
            claimUrl: result[key].externalLink,
            similarity: evidence.similarity,
          });
        });
      });
      resultList.sort((a, b) => b.similarity - a.similarity);
      resultList = resultList.slice(0, 3);
      yield put(stateStorageFunction(resultList, false, true, false));
    } else {
      yield put(stateStorageFunction(null, false, true, false));
    }
  } catch (error) {
    console.log(error);
    yield put(stateStorageFunction(null, false, false, true));
  }
}

function* handleSourceCredibilityCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    yield put(
      setInputSourceCredDetails(
        null,
        null,
        null,
        null,
        null,
        null,
        true,
        false,
        false,
      ),
    );

    const inputUrl = yield select((state) => state.assistant.inputUrl);
    yield take("SET_SCRAPED_DATA"); // wait until linkList has been created
    const linkList = yield select((state) => state.assistant.linkList);
    const inputUrlLinkList = [inputUrl].concat(linkList);

    let result = [];
    let links = [];
    const batchSize = 20; // batches of links as UDA service has hard limit of 30 seconds
    const parallelCalls = 2; // parallel calls to service, max two at a time
    for (let i = 0; i < inputUrlLinkList.length; i += batchSize) {
      const batchLinks = inputUrlLinkList.slice(i, i + batchSize);
      const batchLinksString = batchLinks.join(" ");
      links.push(batchLinksString);

      if (links.length == parallelCalls) {
        const [batchResult1, batchResult2] = yield all([
          call(assistantApi.callSourceCredibilityService, [links[0]]),
          call(assistantApi.callSourceCredibilityService, [links[1]]),
        ]);
        links = [];

        if (batchResult1.entities.SourceCredibility) {
          result = result.concat(batchResult1.entities.SourceCredibility);
        }
        if (batchResult2.entities.SourceCredibility) {
          result = result.concat(batchResult2.entities.SourceCredibility);
        }
      }
    }
    if (links.length) {
      const batchResult = yield call(
        assistantApi.callSourceCredibilityService,
        [links[0]],
      );
      if (batchResult.entities.SourceCredibility) {
        result = result.concat(batchResult.entities.SourceCredibility);
      }
    }
    if (!result.length) {
      result = null;
    }

    const trafficLightColors = {
      positive: "success", //"#008000", // green
      mixed: "warning", //"#FFA500", // orange
      caution: "error", //"#FF0000", // red
      unlabelled: "inherit",
    };

    const [
      positiveResults,
      mixedResults,
      cautionResults,
      filteredExtractedResults,
    ] = filterSourceCredibilityResults(
      result,
      inputUrl,
      linkList,
      trafficLightColors,
    );

    const extractedLinks = sortSourceCredibilityLinks(
      filteredExtractedResults,
      trafficLightColors,
    );

    yield put(
      setInputSourceCredDetails(
        positiveResults,
        cautionResults,
        mixedResults,
        filteredExtractedResults,
        trafficLightColors,
        extractedLinks,
        false,
        true,
        false,
      ),
    );
  } catch (error) {
    console.log(error);
    yield put(
      setInputSourceCredDetails(
        null,
        null,
        null,
        null,
        null,
        null,
        false,
        false,
        true,
      ),
    );
  }
}

function* handleDbkfTextCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const text = yield select((state) => state.assistant.urlText);
    if (text) {
      let textToUse = text.length > 500 ? text.substring(0, 500) : text;
      /*
            let textRegex = /[\W]$/
            //Infinite loop for some url exemple: https://twitter.com/TheArchitect009/status/1427280578496303107
            while(textToUse.match(textRegex)){
                if(textToUse.length === 1) break
                textToUse = text.slice(0, -1)
            }*/
      let result = yield call(dbkfAPI.callTextSimilarityEndpoint, textToUse);
      let filteredResult = result.length ? result : null;

      yield put(setDbkfTextMatchDetails(filteredResult, false, true, false));
    }
  } catch (error) {
    console.log(error);
    yield put(setDbkfTextMatchDetails(null, false, false, true));
  }
}

function* handleNewsTopicCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const text = yield select((state) => state.assistant.urlText);

    if (text) {
      yield put(setNewsTopicDetails(null, true, false, false));

      const result = yield call(assistantApi.callNewsFramingService, text);
      yield put(setNewsTopicDetails(result, false, true, false));
    }
  } catch (error) {
    yield put(setNewsTopicDetails(null, false, false, true));
  }
}

function* handleNewsGenreCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const text = yield select((state) => state.assistant.urlText);

    if (text) {
      yield put(setNewsGenreDetails(null, true, false, false));

      const result = yield call(assistantApi.callNewsGenreService, text);
      yield put(setNewsGenreDetails(result, false, true, false));
    }
  } catch (error) {
    yield put(setNewsGenreDetails(null, false, false, true));
  }
}

function* handlePersuasionCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const text = yield select((state) => state.assistant.urlText);

    if (text) {
      yield put(setPersuasionDetails(null, true, false, false));

      const result = yield call(assistantApi.callPersuasionService, text);
      yield put(setPersuasionDetails(result, false, true, false));
    }
  } catch (error) {
    yield put(setPersuasionDetails(null, false, false, true));
  }
}

const SERVER_TIMEOUT_LIMIT = 6000;

const getTextChunks = (text) => {
  // todo - split around a full stop after SERVER_TIMEOUT_LIMIT
  let textChunks = [];
  if (text.length > SERVER_TIMEOUT_LIMIT) {
    for (let i = 0; i < text.length; i += SERVER_TIMEOUT_LIMIT) {
      textChunks.push(text.substring(i, i + SERVER_TIMEOUT_LIMIT));
    }
  } else {
    // single chunk as text less than limit
    textChunks.push(text);
  }
  return textChunks;
};

function* handleSubjectivityCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const text = yield select((state) => state.assistant.urlText);

    if (text) {
      yield put(setSubjectivityDetails(null, true, false, false));

      // collect chunks of text
      const textChunks = getTextChunks(text);

      // collect results for each chunk
      let result = {};
      let step = 0;
      for (let i = 0; i < textChunks.length; i += 1) {
        console.log(
          "Subjectivity service: sending text chunk",
          i + 1,
          "/",
          textChunks.length,
        );
        const textChunkResult = yield call(
          assistantApi.callSubjectivityService,
          textChunks[i],
        );

        // merge results
        if (i == 0) {
          result = textChunkResult;
        } else {
          // add step to sentences indices and Important_Sentence indices
          step = i * SERVER_TIMEOUT_LIMIT;

          // merge Important_Sentence if any exist
          let stepImportantSentences = [];
          for (
            let j = 0;
            j < textChunkResult.entities
              ? textChunkResult.entities.Important_Sentence.length
              : null;
            j += 1
          ) {
            let importantSentence =
              textChunkResult.entities.Important_Sentence[j];

            stepImportantSentences.push({
              indices: [
                importantSentence.indices[0] + step,
                importantSentence.indices[1] + step,
              ],
              score: importantSentence.score,
            });
          }

          // merge sentences
          let stepSentences = [];
          for (let k = 0; k < textChunkResult.sentences.length; k += 1) {
            let sentence = textChunkResult.sentences[k];

            stepSentences.push({
              indices: [sentence.indices[0] + step, sentence.indices[1] + step],
              score: sentence.score,
              label: sentence.label,
              sentence: sentence.sentence,
            });
          }

          // update results
          result = {
            text: result.text + textChunkResult.text,
            configs: result.configs,
            entities: {
              Important_Sentence: result.entities.Important_Sentence.concat(
                stepImportantSentences,
              ),
              Subjective: result.entities.Subjective,
            },
            sentences: result.sentences.concat(stepSentences),
          };
        }
      }

      yield put(setSubjectivityDetails(result, false, true, false));
    }
  } catch (error) {
    yield put(setSubjectivityDetails(null, false, false, true));
  }
}

const URL_BUFFER_LIMIT = 6000;

function* handlePrevFactChecksCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const text = yield select((state) => state.assistant.urlText);

    // this prevents the call from happening if not correct user status
    const role = yield select((state) => state.userSession.user.roles);

    if (text && role.includes("BETA_TESTER")) {
      yield put(setPrevFactChecksDetails(null, true, false, false));

      const result = yield call(
        assistantApi.callPrevFactChecksService,
        text.substring(0, URL_BUFFER_LIMIT),
      );

      yield put(
        setPrevFactChecksDetails(
          result.fact_checks.length > 0 ? result.fact_checks : null,
          false,
          true,
          false,
        ),
      );
    }
  } catch (error) {
    yield put(setPrevFactChecksDetails(null, false, false, true));
  }
}

function* handleMachineGeneratedTextChunksCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const text = yield select((state) => state.assistant.urlText);

    if (text) {
      yield put(setMachineGeneratedTextChunksDetails(null, true, false, false));

      const result = yield call(
        assistantApi.callMachineGeneratedTextChunksService,
        text.substring(0, URL_BUFFER_LIMIT),
      );

      yield put(
        setMachineGeneratedTextChunksDetails(result, false, true, false),
      );
    }
  } catch (error) {
    yield put(setMachineGeneratedTextChunksDetails(null, false, false, true));
  }
}

function* handleMachineGeneratedTextSentencesCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const text = yield select((state) => state.assistant.urlText);

    if (text) {
      yield put(
        setMachineGeneratedTextSentencesDetails(null, true, false, false),
      );

      const result = yield call(
        assistantApi.callMachineGeneratedTextSentencesService,
        text.substring(0, URL_BUFFER_LIMIT),
      );

      yield put(
        setMachineGeneratedTextSentencesDetails(result, false, true, false),
      );
    }
  } catch (error) {
    yield put(
      setMachineGeneratedTextSentencesDetails(null, false, false, true),
    );
  }
}

function* handleNamedEntityCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const text = yield select((state) => state.assistant.urlText);
    const textLang = yield select((state) => state.assistant.textLang);
    if (text !== null && NE_SUPPORTED_LANGS.includes(textLang)) {
      yield put(setNeDetails(null, null, true, false, false));
      const result = yield call(
        assistantApi.callNamedEntityService,
        text,
        textLang,
      );
      let entities = [];

      Object.entries(result.response.annotations).forEach((entity) => {
        entity[1].forEach((instance) => {
          if (instance.features.string) {
            entities.push({
              word: instance.features.string,
              category: entity[0],
            });
          }
        });
      });

      if (entities.length === 0) {
        yield put(setNeDetails(null, null, false, true, false));
      } else {
        let wordCloudList = buildWordCloudList(entities);
        let categoryList = buildCategoryList(wordCloudList);
        categoryList.map((v, k) => {
          return categoryList[k].words.sort(function (a, b) {
            return b.value - a.value;
          });
        });
        categoryList.sort();
        yield put(
          setNeDetails(categoryList, wordCloudList, false, true, false),
        );
      }
    }
  } catch (error) {
    yield put(setNeDetails(null, null, false, false, true));
  }
}

function* handleAssistantScrapeCall(action) {
  let inputUrl = action.payload.inputUrl;

  inputUrl = cleanInputUrl(inputUrl);

  yield put(cleanAssistantState());
  yield put(setUrlMode(true));
  yield put(setAssistantLoading(true));

  let urlType = matchPattern(inputUrl, KNOWN_LINK_PATTERNS);
  let contentType = matchPattern(inputUrl, TYPE_PATTERNS);
  let instagram_local = window.localStorage.getItem("instagram_result");

  if (urlType === KNOWN_LINKS.INSTAGRAM && instagram_local) {
    yield call(extractFromLocalStorage, instagram_local, inputUrl, urlType);
    return;
  }

  // if urlType is TELEGRAM, check formatting
  if (urlType === KNOWN_LINKS.TELEGRAM) {
    inputUrl = formatTelegramLink(inputUrl);
  }

  try {
    let scrapeResult = null;
    if (decideWhetherToScrape(urlType, contentType, inputUrl)) {
      scrapeResult = yield call(
        assistantApi.callAssistantScraper,
        urlType,
        inputUrl,
      );
    }

    let filteredSR = filterAssistantResults(
      urlType,
      contentType,
      inputUrl,
      scrapeResult,
    );

    yield put(
      setMissingMedia(
        urlType === KNOWN_LINKS.INSTAGRAM && scrapeResult.missing_media,
      ),
    );
    yield put(setInputUrl(inputUrl, urlType));
    yield put(
      setScrapedData(
        filteredSR.urlText,
        filteredSR.textLang,
        filteredSR.linkList,
        filteredSR.imageList,
        filteredSR.videoList,
        filteredSR.urlTextHtmlMap,
        filteredSR.collectedComments,
      ),
    );
    yield put(setAssistantLoading(false));
  } catch (error) {
    yield put(setAssistantLoading(false));

    if (urlType === KNOWN_LINKS.INSTAGRAM && !instagram_local) {
      yield put(setErrorKey("assistant_error_instagram"));
    } else {
      yield put(setErrorKey(error.message));
    }
  }
}

// Multilingual Stance Classification for YouTube Comments
function* handleMultilingualStanceCall(action) {
  if (action.type === "CLEAN_STATE") return;

  try {
    const collectedComments = yield select(
      (state) => state.assistant.collectedComments,
    );

    function createCommentArray(
      comments,
      convertedComments,
      comparisonText,
      comparisonTextId,
    ) {
      comments.forEach((comment) => {
        convertedComments.push({
          text: comment.textOriginal,
          id_str: comment.id,
          in_reply_to_status_id_str: comparisonTextId,
        });
        // add replies comparing to their top level comment and its id
        if ("replies" in comment) {
          createCommentArray(
            comment.replies,
            convertedComments,
            comment.textOriginal,
            comment.id,
          );
        }
      });
    }

    // add video title with id as main comparison for top level comments
    let convertedComments = [
      {
        text: collectedComments[0].videoTitle,
        id_str: collectedComments[0].videoId,
      },
    ];
    createCommentArray(
      collectedComments,
      convertedComments,
      collectedComments[0].videoTitle,
      collectedComments[0].videoId,
    );

    if (convertedComments) {
      yield put(setMultilingualStanceDetails(null, true, false, false));

      const result = yield call(
        assistantApi.callMultilingualStanceService,
        convertedComments,
      );

      yield put(setMultilingualStanceDetails(result, false, true, false));
    }
  } catch (error) {
    yield put(setMultilingualStanceDetails(null, false, false, true));
  }
}

/**
 * Ensure input url is trimmed of whitespaces, returns ONLY the first link
 * if there's multiple links separated by whitespaces
 * @param inputUrl
 * @returns string
 */
function cleanInputUrl(inputUrl) {
  return inputUrl.trim().split(" ")[0];
}

function* extractFromLocalStorage(instagram_result, inputUrl, urlType) {
  instagram_result = instagram_result.split(",plugin-split,");

  let text_result = instagram_result[0];
  let image_result = [instagram_result[1]];
  let video_result = instagram_result[2];

  if (text_result === "") {
    text_result = null;
  } else {
    let regex_emoji = /\\u.{4}/g;
    text_result = text_result.replaceAll(regex_emoji, "");
    text_result = text_result.replaceAll("\\n", " ");

    if (text_result.includes("on Instagram")) {
      let text = text_result.split("on Instagram: ");
      text_result = text.length > 1 ? text[1] : text_result;
    }
  }

  if (video_result !== "") {
    video_result.replace("\\u0026", "%");
    video_result = [video_result];
    image_result = [];
  }

  window.localStorage.removeItem("instagram_result");

  yield put(setInputUrl(inputUrl, urlType));
  yield put(
    setScrapedData(
      text_result,
      null,
      [],
      image_result,
      video_result,
      null,
      null,
    ),
  );
  yield put(setAssistantLoading(false));
}

/**
 * Replaces "t.me/" with "t.me/s/" in telegram links if required.
 * @param {String} url
 * @return {String} url
 */
function formatTelegramLink(url) {
  let urlType = matchPattern(url, KNOWN_LINK_PATTERNS);
  if (urlType !== KNOWN_LINKS.TELEGRAM) {
    throw new Error(
      "formatTelegramLink: Expected telegram link but got " + urlType,
    );
  }

  // Check if the embed parameter already exists
  const hasEmbed = url.includes("?embed=");

  const newUrl = url.replace("t.me/s/", "t.me/");

  // Add ?embed=1 if not already present
  return hasEmbed ? newUrl : `${newUrl}?embed=1`;
}
/**
 * PREPROCESS FUNCTIONS
 **/
const decideWhetherToScrape = (urlType, contentType) => {
  switch (urlType) {
    case KNOWN_LINKS.YOUTUBESHORTS:
    case KNOWN_LINKS.LIVELEAK:
    case KNOWN_LINKS.VIMEO:
    case KNOWN_LINKS.DAILYMOTION:
      return false;
    case KNOWN_LINKS.YOUTUBE:
    case KNOWN_LINKS.TIKTOK:
    case KNOWN_LINKS.INSTAGRAM:
    case KNOWN_LINKS.FACEBOOK:
    case KNOWN_LINKS.TWITTER:
    case KNOWN_LINKS.SNAPCHAT:
    case KNOWN_LINKS.BLUESKY:
    case KNOWN_LINKS.TELEGRAM:
    case KNOWN_LINKS.MASTODON:
    case KNOWN_LINKS.VK:
      return true;
    case KNOWN_LINKS.MISC:
      if (contentType === null) {
        return true;
      }
      return false;
    default:
      throw new Error("please_give_a_correct_link");
  }
};

/**
 * POSTPROCESS FUNCTIONS
 **/
const buildWordCloudList = (entities) => {
  return entities.reduce((accumulator, currentWord) => {
    accumulator.filter((wordObj) => wordObj.value === currentWord["word"])
      .length
      ? (accumulator.filter(
          (wordObj) => wordObj.value === currentWord["word"],
        )[0].count += 1)
      : accumulator.push({
          value: currentWord["word"],
          category: currentWord["category"],
          count: 1,
        });

    return accumulator;
  }, []);
};

const buildCategoryList = (wordCloudList) => {
  // group by category
  return wordCloudList.reduce((accumulator, currentWord) => {
    accumulator.filter(
      (wordObj) => wordObj.category === currentWord["category"],
    ).length
      ? accumulator
          .filter((wordObj) => wordObj.category === currentWord["category"])[0]
          .words.push(currentWord)
      : accumulator.push({
          category: currentWord["category"],
          words: [currentWord],
        });

    return accumulator;
  }, []);
};

const filterAssistantResults = (
  urlType,
  contentType,
  userInput,
  scrapeResult,
) => {
  let videoList = [];
  let imageList = [];
  let linkList = [];
  let urlText = null;
  let urlTextHtmlMap = null;
  let textLang = null;
  let collectedComments = null;

  switch (urlType) {
    case KNOWN_LINKS.YOUTUBE:
    case KNOWN_LINKS.YOUTUBESHORTS:
    case KNOWN_LINKS.LIVELEAK:
    case KNOWN_LINKS.VIMEO:
    case KNOWN_LINKS.DAILYMOTION:
      videoList = [userInput];
      break;
    case KNOWN_LINKS.TIKTOK:
      videoList = scrapeResult.videos;
      break;
    case KNOWN_LINKS.INSTAGRAM:
      if (scrapeResult.videos.length === 1) {
        videoList = [scrapeResult.videos[0]];
      } else {
        imageList = [scrapeResult.images[0]];
      }
      break;
    case KNOWN_LINKS.FACEBOOK:
      if (scrapeResult.videos.length === 0) {
        imageList = scrapeResult.images;
      } else {
        videoList = scrapeResult.videos;
      }
      break;
    case KNOWN_LINKS.TWITTER:
      if (scrapeResult.images.length > 0) {
        imageList = scrapeResult.images;
      }
      if (scrapeResult.videos.length > 0) {
        videoList = scrapeResult.videos;
      }
      break;
    case KNOWN_LINKS.SNAPCHAT:
    case KNOWN_LINKS.BLUESKY:
      if (scrapeResult.images.length > 0) {
        imageList = scrapeResult.images;
      }
      if (scrapeResult.videos.length > 0) {
        videoList = scrapeResult.videos;
      }
      break;
    case KNOWN_LINKS.MASTODON:
    case KNOWN_LINKS.TELEGRAM:
    case KNOWN_LINKS.VK:
      if (scrapeResult.images.length > 0) {
        imageList = scrapeResult.images;
      }
      if (scrapeResult.videos.length > 0) {
        videoList = scrapeResult.videos;
      }
      break;
    case KNOWN_LINKS.MISC:
      if (contentType) {
        contentType === CONTENT_TYPE.IMAGE
          ? (imageList = [userInput])
          : (videoList = [userInput]);
      } else {
        imageList = scrapeResult.images;
        // very specific. consider reworking to all svg images!
        imageList = imageList.filter(
          (imageUrl) => !imageUrl.includes("loader.svg"),
        );
        videoList = scrapeResult.videos;
      }
      break;
    default:
      break;
  }

  if (scrapeResult) {
    urlText = scrapeResult.text;
    textLang = scrapeResult.lang;
    linkList = scrapeResult.links
      .sort()
      .filter((value, index, array) => array.indexOf(value) === index);
    urlTextHtmlMap = scrapeResult.text_html_mapping;

    if ("collected_comments" in scrapeResult) {
      collectedComments = scrapeResult.collected_comments;
    }
  }

  return {
    urlText: urlText,
    textLang: textLang,
    videoList: videoList,
    imageList: imageList,
    linkList: linkList,
    urlTextHtmlMap: urlTextHtmlMap,
    collectedComments: collectedComments,
  };
};

const filterSourceCredibilityResults = (
  originalResult,
  inputUrl,
  linkList,
  trafficLightColors,
) => {
  if (!originalResult) {
    return [null, null, null, null];
  }
  let sourceCredibility = originalResult;

  sourceCredibility.forEach((dc) => {
    delete dc["indices"];
  });
  sourceCredibility = uniqWith(sourceCredibility, isEqual);

  let sourceCredibilityDict = {};

  // collecting results for each link in extracted linkList
  sourceCredibility.forEach((result) => {
    const link = result["string"];

    if (!(link in sourceCredibilityDict)) {
      sourceCredibilityDict[link] = {
        link: link,
        resolvedLink: result["resolved-url"],
        resolvedDomain: result["resolved-domain"],
        urlColor: trafficLightColors.unlabelled,
        positive: [],
        mixed: [],
        caution: [],
      };
    }

    if (result["source-type"] === "positive") {
      addToRelevantSourceCred(sourceCredibilityDict[link].positive, result);
    } else if (
      result["source-type"] === "mixed" &&
      result["source"] !== "GDI-MMR"
    ) {
      addToRelevantSourceCred(sourceCredibilityDict[link].mixed, result);
    } else if (result["source-type"] === "caution") {
      addToRelevantSourceCred(sourceCredibilityDict[link].caution, result);
    }
  });

  // catching the missing links without source credibility results
  for (let link of linkList) {
    if (!sourceCredibilityDict[link]) {
      sourceCredibilityDict[link] = {
        link: link,
        resolvedLink: link,
        resolvedDomain: "",
        urlColor: trafficLightColors.unlabelled,
        positive: [],
        mixed: [],
        caution: [],
      };
    }
  }

  // collecting results for the inputUrl
  const positiveResults = sourceCredibilityDict[inputUrl]
    ? sourceCredibilityDict[inputUrl].positive
    : null;
  const mixedResults = sourceCredibilityDict[inputUrl]
    ? sourceCredibilityDict[inputUrl].mixed
    : null;
  const cautionResults = sourceCredibilityDict[inputUrl]
    ? sourceCredibilityDict[inputUrl].caution
    : null;
  delete sourceCredibilityDict[inputUrl];

  return [positiveResults, mixedResults, cautionResults, sourceCredibilityDict];
};

const sortSourceCredibilityLinks = (
  sourceCredibilityDict,
  trafficLightColors,
) => {
  if (!sourceCredibilityDict) {
    return null;
  }

  let positiveLinks = [];
  let mixedLinks = [];
  let cautionLinks = [];
  let unlabelledLinks = [];

  for (let link in sourceCredibilityDict) {
    let result = sourceCredibilityDict[link];

    result.positive = result.positive.length ? result.positive : null;
    result.mixed = result.mixed.length ? result.mixed : null;
    result.caution = result.caution.length ? result.caution : null;

    if (result.caution) {
      result.urlColor = trafficLightColors.caution;
      cautionLinks.push(link);
    } else if (result.mixed) {
      result.urlColor = trafficLightColors.mixed;
      mixedLinks.push(link);
    } else if (result.positive) {
      result.urlColor = trafficLightColors.positive;
      positiveLinks.push(link);
    } else {
      result.urlColor = trafficLightColors.unlabelled;
      unlabelledLinks.push(link);
    }
  }

  let extractedLinks = [];
  extractedLinks = extractedLinks.concat(
    cautionLinks,
    mixedLinks,
    positiveLinks,
    unlabelledLinks,
  );

  return extractedLinks;
};

const addToRelevantSourceCred = (sourceCredList, result) => {
  let resultEvidence = result["evidence"] ? result["evidence"] : [];
  if (resultEvidence.length) {
    resultEvidence = resultEvidence.toString();
    resultEvidence = resultEvidence.split(",");
  }

  sourceCredList.push({
    credibilityUrl: result["string"],
    credibilitySource: result["source"],
    credibilityLabels: result["labels"],
    credibilityDescription: result["description"],
    credibilityEvidence: resultEvidence,
    credibilityScope: result["credibility-scope"],
  });
};

const scaleNumbers = (unscaledNums) => {
  let scaled = [];
  let maxRange = Math.max.apply(Math, unscaledNums);
  let minRange = Math.min.apply(Math, unscaledNums);

  for (let i = 0; i < unscaledNums.length; i++) {
    let unscaled = unscaledNums[i];
    let scaledNum = (100 * (unscaled - minRange)) / (maxRange - minRange);

    scaled.push(scaledNum);
  }
  return scaled;
};

/**
 * EXPORT
 **/
export default function* assistantSaga() {
  yield all([
    fork(getDbkfTextMatchSaga),
    fork(getSourceCredSaga),
    fork(getMediaActionSaga),
    fork(getMediaSimilaritySaga),
    fork(getMediaListSaga),
    fork(getNamedEntitySaga),
    fork(getAssistantScrapeSaga),
    fork(getUploadSaga),
    fork(getNewsTopicSaga),
    fork(getNewsGenreSaga),
    fork(getPersuasionSaga),
    fork(getSubjectivitySaga),
    fork(getPrevFactChecksSaga),
    fork(getMultilingualStanceSaga),
    fork(getMachineGeneratedTextChunksSaga),
    fork(getMachineGeneratedTextSentencesSaga),
  ]);
}

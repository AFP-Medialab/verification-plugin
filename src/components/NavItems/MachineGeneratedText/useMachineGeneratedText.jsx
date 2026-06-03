import { useMutation } from "@tanstack/react-query";

import useAuthenticatedRequest from "@Shared/Authentication/useAuthenticatedRequest";

export function useMachineGeneratedText() {
  /**
   * Maps a machine-generated score to a predicted classification label and associated RGB color values for light and dark themes.
   *
   * @param {number} score - The score from the machine-generated text analysis, ranging from 0 to 1.
   * @returns {[string, RGB, RGB]} - A tuple containing:
   *   1. The prediction label (e.g. "likely_human"),
   *   2. An array of RGB values for light mode,
   *   3. An array of RGB values for dark mode.
   */
  const getPredictionRGB = (score) => {
    let pred, rgb, rgbDark;

    const HIGHLY_LIKELY_HUMAN_RGB = [0, 255, 0];
    const HIGHLY_LIKELY_HUMAN_RGB_DARK = [78, 255, 78];

    const LIKELY_HUMAN_RGB = [170, 255, 0];
    const LIKELY_HUMAN_RGB_DARK = [210, 255, 121];

    const LIKELY_MACHINE_RGB = [252, 170, 0];
    const LIKELY_MACHINE_RGB_DARK = [255, 189, 62];

    const HIGHLY_LIKELY_MACHINE_RGB = [252, 0, 0];
    const HIGHLY_LIKELY_MACHINE_RGB_DARK = [255, 78, 78];

    if (score >= 0 && score < 0.05) {
      pred = "highly_likely_human";
      rgb = HIGHLY_LIKELY_HUMAN_RGB;
      rgbDark = HIGHLY_LIKELY_HUMAN_RGB_DARK;
    } else if (score >= 0.05 && score < 0.5) {
      pred = "likely_human";
      rgb = LIKELY_HUMAN_RGB;
      rgbDark = LIKELY_HUMAN_RGB_DARK;
    } else if (score >= 0.5 && score < 0.95) {
      pred = "likely_machine";
      rgb = LIKELY_MACHINE_RGB;
      rgbDark = LIKELY_MACHINE_RGB_DARK;
    } else if (score >= 0.95 && score <= 1) {
      pred = "highly_likely_machine";
      rgb = HIGHLY_LIKELY_MACHINE_RGB;
      rgbDark = HIGHLY_LIKELY_MACHINE_RGB_DARK;
    } else {
      pred = "failed_to_load";
      rgb = [0.0, 0.0, 0.0];
      rgbDark = [0.0, 0.0, 0.0];
    }

    return [pred, rgb, rgbDark];
  };

  /**
   * Converts the machine-generated text response into a format compatible with the application's expected structure.
   *
   * @param {Object} machineGeneratedTextResponse - The machine-generated text analysis, containing overall score and annotated chunks.
   * @returns {MachineGeneratedTextResult} - The response with the converted structure including overall score, color-coded sentence highlights, and labeled entities.
   */
  const convertMGTResponse = (machineGeneratedTextResponse) => {
    /**
     * @type {MachineGeneratedTextResult}
     */
    let convertedResponse = {};

    convertedResponse.entities = {};

    const overallScore = parseFloat(machineGeneratedTextResponse.score);
    const [overallPred, overallRgb, overallRgbDark] =
      getPredictionRGB(overallScore);

    convertedResponse.entities["mgt_overall_score"] = [
      {
        indices: [0, -1],
        score: overallScore.toString(),
        pred: overallPred,
        rgb: overallRgb,
        rgbDark: overallRgbDark,
      },
    ];

    machineGeneratedTextResponse.chunks.forEach((chunk) => {
      const score = parseFloat(chunk.score);
      const [pred, rgb, rgbDark] = getPredictionRGB(score);
      const startIndex = chunk.startchar;
      const endIndex = chunk.endchar + 1;

      if (!convertedResponse.entities[pred]) {
        convertedResponse.entities[pred] = [
          {
            indices: [0, -1],
            score: score.toString(),
            rgb: rgb,
            rgbDark: rgbDark,
          },
        ];
      }

      if (!convertedResponse.entities["Important_Sentence"]) {
        convertedResponse.entities["Important_Sentence"] = [];
      }

      convertedResponse.entities["Important_Sentence"].push({
        indices: [startIndex, endIndex],
        score: score.toString(),
        pred: pred,
        rgb: rgb,
        rgbDark: rgbDark,
      });
    });

    return convertedResponse;
  };

  const authenticatedRequest = useAuthenticatedRequest();

  const getMachineGeneratedTextChunksScores = async (text) => {
    if (typeof text !== "string") {
      throw new Error("The text provided is not a string");
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_MGT_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        q: text,
      },
    };

    return convertMGTResponse((await authenticatedRequest(config)).data);
  };

  const getMachineGeneratedTextSentencesScores = async (text) => {
    if (typeof text !== "string") {
      throw new Error("The text provided is not a string");
    }

    const config = {
      method: "post",
      maxBodyLength: Infinity,
      url: import.meta.env.VITE_MGT_URL,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        q: text,
        chunker: "sentence",
      },
    };

    return convertMGTResponse((await authenticatedRequest(config)).data);
  };

  const mutationChunks = useMutation({
    mutationFn: (text) => getMachineGeneratedTextChunksScores(text),
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const mutationSentences = useMutation({
    mutationFn: (text) => getMachineGeneratedTextSentencesScores(text),
    onSuccess: (data) => {
      // console.log(data);
    },
    onError: (error) => {
      console.error(error);
    },
  });
  return { mutationChunks, mutationSentences };
}

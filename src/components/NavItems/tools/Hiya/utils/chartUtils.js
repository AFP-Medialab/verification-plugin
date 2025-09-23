import dayjs from "dayjs";

import { DETECTION_THRESHOLDS } from "../constants/detectionConstants";

/**
 * Returns a CanvasGradient to stylize the chart with the given scale
 * Creates a gradient that maps detection thresholds to colors
 *
 * @param {CanvasRenderingContext2D} ctx - The canvas rendering context
 * @param {Object} chartArea - Chart area dimensions from Chart.js
 * @param {Object} [cache] - Optional cache object to store gradient for performance
 * @returns {CanvasGradient} Canvas gradient for chart styling
 *
 * @example
 * ```javascript
 * const gradient = getChartGradient(ctx, chartArea);
 * // Use gradient as borderColor in chart dataset
 * ```
 */
export const getChartGradient = (ctx, chartArea, cache = {}) => {
  const chartWidth = chartArea.right - chartArea.left;
  const chartHeight = chartArea.bottom - chartArea.top;

  if (
    !cache.gradient ||
    cache.width !== chartWidth ||
    cache.height !== chartHeight
  ) {
    // Create the gradient because this is either the first render
    // or the size of the chart has changed
    cache.width = chartWidth;
    cache.height = chartHeight;
    cache.gradient = ctx.createLinearGradient(
      0,
      chartArea.bottom,
      0,
      chartArea.top,
    );

    cache.gradient.addColorStop(0, "#00FF00");
    cache.gradient.addColorStop(
      DETECTION_THRESHOLDS.THRESHOLD_1 / 100,
      "#82FF82",
    );
    cache.gradient.addColorStop(
      DETECTION_THRESHOLDS.THRESHOLD_2 / 100,
      "#FFB800",
    );
    cache.gradient.addColorStop(
      DETECTION_THRESHOLDS.THRESHOLD_3 / 100,
      "#FF0000",
    );
  }

  return cache.gradient;
};

/**
 * Returns appropriate color code based on detection percentage
 * Maps percentage values to color codes for visual indicators
 *
 * @param {number} percentage - Detection percentage (0-100)
 * @returns {string} RGBA color string
 *
 * @example
 * ```javascript
 * getPercentageColorCode(15) // Returns "rgb(170, 255, 3, 0.5)" (yellow-green)
 * getPercentageColorCode(75) // Returns "rgb(255, 0, 0, 0.5)" (red)
 * ```
 */
export const getPercentageColorCode = (percentage) => {
  if (percentage >= DETECTION_THRESHOLDS.THRESHOLD_3) {
    return "rgb(255, 0, 0, 0.5)"; // Red - High risk
  } else if (percentage >= DETECTION_THRESHOLDS.THRESHOLD_2) {
    return "rgb(255, 170, 0, 0.5)"; // Orange - Medium risk
  } else if (percentage >= DETECTION_THRESHOLDS.THRESHOLD_1) {
    return "rgb(170, 255, 3, 0.5)"; // Yellow-green - Low risk
  } else {
    return "rgb(0, 255, 0, 0.5)"; // Green - No risk
  }
};

/**
 * Converts analysis chunks data into Chart.js compatible format
 * Processes chunk data with time ranges and synthesis scores
 *
 * @param {Array} chunks - Array of analysis chunk objects
 * @param {number} chunks[].startTime - Chunk start time in milliseconds
 * @param {number} chunks[].endTime - Chunk end time in milliseconds
 * @param {Object} chunks[].scores - Score object containing synthesis score
 * @param {number} chunks[].scores.synthesis - Synthesis score (0-1, where 0 is synthetic)
 * @returns {Object} Chart.js data object with labels and datasets
 *
 * @example
 * ```javascript
 * const chunks = [
 *   { startTime: 0, endTime: 5000, scores: { synthesis: 0.8 } },
 *   { startTime: 5000, endTime: 10000, scores: { synthesis: 0.3 } }
 * ];
 * const chartData = getChartDataFromChunks(chunks);
 * // Returns: { labels: [...], datasets: [...] }
 * ```
 */
export const getChartDataFromChunks = (chunks) => {
  const labels = [];
  const datasetData = [];

  for (const chunk of chunks) {
    labels.push(dayjs.duration(chunk.startTime));
    labels.push(dayjs.duration(chunk.endTime));

    // Convert synthesis score to percentage (1 - score means higher percentage = more likely synthetic)
    const detectionPercentage = (1 - chunk.scores.synthesis) * 100;
    datasetData.push(detectionPercentage);
    datasetData.push(detectionPercentage);
  }

  return {
    labels: labels,
    datasets: [
      {
        data: datasetData,
        fill: false,
        stepped: true,
        tension: 0,
        // Note: borderColor should be set dynamically using getChartGradient
      },
    ],
  };
};

/**
 * Creates chart configuration with dynamic theming and internationalization
 *
 * @param {string} resolvedMode - Current theme mode ('light' or 'dark')
 * @param {boolean} isCurrentLanguageLeftToRight - Language direction flag
 * @param {Function} keyword - i18n function for translations
 * @param {Function} printDurationInMinutesWithoutModulo - Time formatting function
 * @returns {Object} Complete chart configuration object
 */
export const createChartConfig = (
  resolvedMode,
  isCurrentLanguageLeftToRight,
  keyword,
  printDurationInMinutesWithoutModulo,
) => {
  const gridColor =
    resolvedMode === "dark" ? "rgba(200, 200, 200, 0.1)" : "rgba(0, 0, 0, 0.1)";

  return {
    type: "line",
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      intersect: false,
      axis: "x",
    },
    plugins: {
      legend: {
        position: "bottom",
        display: false,
      },
      title: {
        display: true,
        text: keyword("hiya_chart_title"),
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return context.formattedValue + "%";
          },
          title: function (context) {
            return printDurationInMinutesWithoutModulo(context[0].parsed.x);
          },
        },
      },
    },
    scales: {
      x: {
        type: "time",
        time: {
          unit: "second",
        },
        grid: {
          color: gridColor,
        },
        ticks: {
          callback: function (val) {
            return printDurationInMinutesWithoutModulo(val);
          },
        },
        reverse: !isCurrentLanguageLeftToRight,
      },
      y: {
        beginAtZero: true,
        min: 0,
        max: 100,
        ticks: {
          callback: function (value) {
            return value + "%";
          },
        },
        position: isCurrentLanguageLeftToRight ? "left" : "right",
        grid: {
          color: gridColor,
        },
      },
    },
  };
};

/**
 * Default chart configuration options for Hiya detection charts
 * Contains responsive settings, interaction modes, and base styling
 */
export const DEFAULT_CHART_CONFIG = {
  type: "line",
  responsive: true,
  maintainAspectRatio: false,
  interaction: {
    intersect: false,
    axis: "x",
  },
};

/**
 * Chart plugin configuration
 * Defines legend, title, and tooltip settings
 */
export const CHART_PLUGINS_CONFIG = {
  legend: {
    position: "bottom",
    display: false,
  },
  title: {
    display: true,
    // Note: title text should be set dynamically using i18n
  },
};

/**
 * Chart scale configuration for time-based x-axis
 */
export const CHART_SCALES_CONFIG = {
  x: {
    type: "time",
    time: {
      unit: "second",
    },
    beginAtZero: true,
  },
  y: {
    beginAtZero: true,
    min: 0,
    max: 100,
  },
};

/**
 * Wavesurfer audio player configuration
 */
export const WAVESURFER_CONFIG = {
  waveColor: "#00926c",
  progressColor: "#005941",
  height: 100,
  backend: "MediaElement",
  mediaControls: true,
  dragToSeek: true,
};

/**
 * Wavesurfer zoom plugin configuration
 */
export const WAVESURFER_ZOOM_CONFIG = {
  scale: 0.5,
  maxZoom: 100,
};

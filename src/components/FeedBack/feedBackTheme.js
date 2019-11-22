/**
 * Convert a hex value to an rgba value
 * @param {String} hex - 6 char hex string (#000000)
 * @param {Float} opacity - rgba opacity
 * @returns {String} returns rgba string
 */
export const rgba = (hex, opacity = 1) => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)

  if (!result) return 'inherit'

  return `rgba(${parseInt(result[1], 16)}, ${parseInt(
      result[2],
      16
  )}, ${parseInt(result[3], 16)}, ${
      isNaN(parseInt(opacity, 10)) ? 1 : opacity
  })`
};

/**
 * Lookup an object property by dot notation
 * @param  {Object} obj - object to perform lookup
 * @param  {String} key - property location
 * @param  {Any} fallback - fallback if not found
 * @return {Any} returns value of lookup if found, otherwise undefined
 */
export const get = (obj, key, fallback) => {
  if (!obj && typeof obj !== 'object') return fallback
  return (
      key
          .split('.')
          .reduce((state, x) => (state && state[x] ? state[x] : null), obj) ||
      fallback
  )
};

export default {
  fontFamily:
    '-apple-system, BlinkMacSystemFont, Arial, Arial Unicode, "Helvetica Neue", Helvetica, "Hiragino Sans GB", "Microsoft YaHei", SimSun, sans-serif',
  colors: {
    border: '#d0d8e1',
    primary: 'rgb(0,170,180)',
    secondary: 'rgb(0,170,180)',
    background: '#f4f4f7',
    success: '#3dc86f',
    error: '#ec3c3c',
    text: '#333333'
  },
  content: {
    width: '380px',
    padding: '0.6em',
    borderRadius: '4px',
    fontSize: '14px',
    fontWeight: 500,
    boxShadow: `0 6px 30px 2px ${rgba('#222c4f', 0.3)}`
  },
  header: {
    color: 'white',
    fontWeight: 400,
    backgroundColor: 'rgb(0,170,180)'
  },
  loader: {
    color: '#ffffff',
    size: '4em',
    width: '3px'
  },
  button: {
    fontWeight: 500,
    boxShadow: `0 2px 8px 2px ${rgba('#0087ff', 0.2)}`,
    opacity: 0.8
  },
  trigger: {
    color: '#ffffff',
    hoverColor: 'rgb(0,170,180)',
    backgroundColor: 'rgb(0,170,180)',
    border: 'none',
    padding: '12px 1.25em',
    borderRadius: '6px',
    fontSize: '14px',
    fontWeight: '400',
    boxShadow: '0 3px 12px 1px rgba(34, 44, 79, 0.1)',
    hoverBoxShadow: '0 6px 16px 2px rgba(0, 0, 0, 0.2)',
    hoverBackgroundColor: 'rgba(0, 170, 160, 0.5)'
  },
  input: {
    backgroundColor: 'white',
    padding: '0.5em',
    color: '#444444',
    fontSize: '14px',
    borderRadius: '4px',
    border: '1px solid #d0d8e1',
    boxShadow: `0 0 8px ${rgba('#00aaa0', 0.3)}`
  },
  label: {
    color: '#222c4f',
    fontSize: '12px'
  },
  tab: {
    color: '#333333',
    selectedColor: 'white',
    selectedBackgroundColor: '#0087ff',
    border: '1px solid #d0d8e1',
    borderRadius: '4px',
    backgroundColor: 'rgba(0, 170, 160, 0.5)'
  },
  image: {
    height: '140px',
    borderRadius: '4px',
    border: '1px solid #d0d8e1'
  },
  uploadButton: {
    color: '#333333',
    hoverColor: '#333333',
    backgroundColor: 'white',
    hoverBackgroundColor: 'rgba(0, 170, 160, 0.6)',
    border: '1px solid #d0d8e1'
  },
  overlay: {
    backgroundColor: rgba('#00aaa0', 0.3)
  }
}

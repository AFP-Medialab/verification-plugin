# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

### Building and Development
- `npm run dev` - Build in development mode with watch
- `npm run srv_dev` - Start webpack dev server
- `npm run build` - Build for production
- `npm install` - Install dependencies

### Testing
- `npm run test` - Run all tests (component/unit + e2e)
- `npm run test-cu` - Run component and unit tests only
- `npm run test-e2e` - Run end-to-end tests only
- `npm run test-e2e-ui` - Run e2e tests with interactive UI

**Important**: E2e tests require the extension to be built first (`npm run build`)

### Code Quality
- ESLint configuration uses flat config format in `eslint.config.mjs`
- Prettier formatting with configuration in `.prettierrc.json`
- Husky pre-commit hooks run prettier on staged files

## Project Architecture

### Browser Extension Structure
This is a React-based browser extension for fact-checking and media verification. The main entry points are:
- `src/index.jsx` - Main popup application entry
- `src/background/index.jsx` - Background script
- `src/background/inject.js` - Content injection script

### Redux State Management
- Uses Redux Toolkit with redux-saga for side effects
- Main store configuration in `src/index.jsx`
- All reducers combined in `src/redux/reducers/index.jsx`
- State categories:
  - Global: language, authentication, cookies, error handling
  - Navigation: nav, tool selection
  - Tools: analysis, forensic, keyframes, magnifier, metadata, etc.

### Component Architecture
- **NavItems**: Main application sections (Assistant, tools, ClassRoom, About, etc.)
- **NavBar**: Navigation with tool icons and routing
- **Shared**: Reusable components across the application
- **PopUp**: Entry point component for the extension popup

### Verification Tools
The extension provides various verification tools organized in `src/components/NavItems/tools/`:
- Video analysis (keyframes, thumbnails)
- Image analysis (forensic, magnifier, metadata, OCR)
- Social media analysis (Twitter SNA)
- Search tools (reverse image search, COVID-19 search)
- Authentication and deepfake detection

### Internationalization
- Uses i18next for translations in 8 languages
- Translation loading in `src/i18n.jsx`
- Remote translation server with caching mechanism
- Offline translations generated via external scripts

### Build Configuration
- Webpack configuration with separate dev/prod configs
- Path aliases: `@` → `src/`, `@Shared` → `src/components/Shared/`
- SVG handling with @svgr/webpack for React components
- Material-UI with Emotion for styling

### Environment Variables
Requires `.env` file with various API endpoints:
- REACT_APP_KEYFRAME_API
- REACT_APP_TRANSLATION_URL
- REACT_APP_ASSISTANT_URL
- Plus numerous other service URLs

### Testing Framework
Uses Playwright for all testing:
- Component tests use experimental Playwright component testing
- E2e tests load the built extension into browser
- Test fixtures in `/tests/e2e/fixtures.ts` provide extension context
- Configurations in `playwright.config.ts` and `playwright-ct.config.js`

## Key Development Notes

### File Structure Patterns
- React components use `.jsx` extension
- Redux files organized by feature in `src/redux/`
- Images and assets in component-specific directories
- Public assets in `/public/` copied during build

### State Persistence
- Redux state partially persisted to localStorage
- Selective persistence for user preferences and session data
- Automatic cleanup based on cookie consent

### Extension Loading
For development, load the extension from the `build/` folder in Chrome developer mode after running `npm run build`.
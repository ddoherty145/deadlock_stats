# V1.2 Workflow Documentation

## Complexity Level 1 Task: Single-File Refactoring
**Task:** Add loading states and better error messages to popup.js

### Approach Used: Iterative Refinement
1. Identified areas needing improvement (loading states, error messages)
2. Made incremental changes to popup.js
3. Ran tests after each change to ensure nothing broke
4. Verified UI changes manually

### Files Modified:
- `popup.js` - Added loading spinners and enhanced error messages

### Workflow Steps:
1. Read the existing code to understand structure
2. Added CSS classes for loading states
3. Modified fetch functions to show loading indicators
4. Enhanced error messages with more context
5. Tested each change before moving to next

---

## Complexity Level 2 Task: Multi-File Feature Addition
**Task:** Add dark/light theme toggle

### Approach Used: Design-First Implementation
1. Designed the theme system architecture
2. Created CSS variables for theming
3. Added theme toggle UI component
4. Implemented localStorage persistence
5. Updated all color references to use variables

### Files Modified:
- `popup.css` - Added CSS variables and theme styles
- `popup.html` - Added theme toggle button
- `popup.js` - Implemented theme switching logic

### Design Decisions:
1. **CSS Variables**: Used CSS custom properties for easy theme switching
2. **LocalStorage**: Persist user preference across sessions
3. **Default Theme**: Dark theme as default (matches original design)
4. **Toggle Position**: Top-right corner for easy access

### Workflow Steps:
1. Created design specification for theme system
2. Defined CSS variable palette for both themes
3. Implemented toggle component in HTML
4. Added CSS for light theme overrides
5. Created JavaScript theme manager
6. Added event listeners and persistence
7. Tested both themes thoroughly

---

## Complexity Level 3 Task: Architectural / Cross-Cutting Change
**Task:** Swap data layer to use a persistent background service worker with IndexedDB caching

### Approach Used: Design-Doc-First
1. Write a short design doc (problem, options considered, chosen approach, rollback plan)
2. Get review/sign-off on the design before touching any code
3. Create a feature branch
4. Write tests for the new architecture (TDD red phase) and commit them
5. Implement in layers: data layer first, then UI adapters, then integration
6. Run full quality gate suite (Gates 1–5 in spec.md) before merging
7. Update spec.md and CLAUDE.md to reflect any new constraints

### Files Modified (example):
- `manifest.json` - Add `background` service worker declaration
- `background.js` - New service worker with IndexedDB logic
- `popup.js` - Replace direct fetch calls with `chrome.runtime.sendMessage`
- `__tests__/background.test.js` - New test file (committed before implementation)

### Design Decisions to Document:
1. **Why IndexedDB vs localStorage?** Size limits and async API
2. **Message passing protocol** between popup and service worker
3. **Cache invalidation strategy** (TTL, version key, etc.)
4. **Fallback behaviour** when service worker is unavailable

### Workflow Steps:
1. Open a GitHub/Linear issue describing the change
2. Write and commit a design note in `docs/design-<feature>.md`
3. Create branch: `feat/background-service-worker`
4. Commit failing tests (TDD red)
5. Implement in small, reviewable commits
6. Run `npm test && npm run build`
7. Open PR, reference the design doc and spec gates
8. Merge only after all gates pass

---

## Test Coverage
All changes were tested using:
- `npm test` - Jest unit tests
- Manual testing in Chrome extension

## Final Test Results
- Test Suites: 4 passed
- Tests: 55 passed
- Coverage: All critical paths tested

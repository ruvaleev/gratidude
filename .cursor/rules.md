# 🧠 React Native Guide (for AI assistants)

> TL;DR — React Native 0.79.5 + Expo ~53, Redux Toolkit everywhere, axios wrapper with strict error handling, jest-expo tests with extensive mocks. Follow these notes to stay aligned.

## 1. Stack & Workflow

- Use yarn, not npm
- For linting use eslint
- Expo config (`app.config.js`) switches names, bundle IDs, Google-services files and schemes via `APP_VARIANT`. Custom plugin `plugins/withLaunchMode.js` tweaks Android intent filters.
- `jsconfig.json` defines absolute aliases (`__components`, `__redux`, `__services`, etc.). No relative spaghetti.
- Fonts, icons, localization, navigation and analytics are initialized inside `App.jsx`. Any global listener (NetInfo, notifications, tutorial hydration, Update checks) is wired once at the top level.

## 2. Architectural Principles

- **Internationalization:** `i18n` with react-i18next. `useLocale` hook listens to `signIn.user.locale` and updates i18n automatically.

## 3. State Management (Redux Toolkit)

- **Slices pattern:**  
  - normalized `byId` + helper indexes (`byDate`, `order`).  
  - `isLoading/isErrored/errors` flags to surface UI states.  
  - extraReducers respond to RTK thunks only; keep reducers pure.
- **Pending/offline:** `pendingImages`, `pendingFoods`, `pendingDiariesFoods` keep offline items; IDs may start with `temporaryDiaryId(date)`. `initializePendingRequestsObserver` (NetInfo listener) flushes queues once back online.
- **Timers:** `components/TimersController.jsx` + `timers` slice orchestrate scheduled callbacks (e.g., delayed `logFoodAsync`). Never call `setTimeout` directly in UI—dispatch timer actions instead so they survive reloads.
- **Middlewares:**  
  - `errorsMiddleware`: logs out on `"unauthorized"` and redirects to paywall on `"subscription_required"`.  
  - `subscriptionsMiddleware`: after a successful RevenueCat purchase, replays failed diary foods with that error code.  
  - `timersMiddleware`: clears JS timers when store timers are removed.  
  - `tutorialMiddleware`: syncs Copilot progress to AsyncStorage + cancels active tour when resetting.

## 4. API Layer & Networking

- **Axios wrapper (`extra/axios.js`):**  
  - Sets JSON headers, base URL from env, rejects statuses ≥400.  
  - Injects `Authorization: bearer <token>` except `/omniauth`.  
  - Deduplicates inflight requests via `pendingRequests` map.  
  - Adds NetInfo gate: offline requests reject with synthetic `ERR_NETWORK`.
- **Services (`services/*.js`):** thin wrappers around `request` for each domain (diaries, foods, images, users, purchases...). They always resolve with `response` or reject with parsed backend error.
- **Error shape:** `NewErrorsHandler` collapses API responses into `Error(JSON.stringify([...]))`. Thunks `throw` this, and slices parse it back to show UI errors.
- **Async thunks:** live in `redux/thunks`. They handle side effects + normalization (e.g., `findOrCreateDiary`, `logFoodAsync`, `uploadImageAsync`, `purchasePackage`). Never fetch inside components; always go through thunks.
- **Offline safety:**  
  - Use helper `temporaryDiaryId` before real diary exists.  
  - After server sync, thunks replace temp IDs across slices/forms/pending queues.  
  - When writing new flows, check if they need pending state + NetInfo retry.

## 5. Testing Strategy

- **Runner/config:** `jest-expo` preset (`jest.config.js`). `testMatch = **.test.js`; `moduleNameMapper` replaces Firebase, RevenueCat, SVGs with mocks; `transformIgnorePatterns` whitelists RN/Expo deps.
- **Global setup (`__tests__/jest-setup.js`):**  
  - Loads i18n, mocks AsyncStorage, SafeArea, Reanimated, Modal, Expo camera/image modules, fonts, notifications warnings.  
  - Provides `global.setupModernTimers` / `global.setupLegacyTimers`. Default = legacy timers for compatibility.
- **HTTP mocking:** `__tests__/shared/mockedAxios.js` attaches an `axios-mock-adapter` instance with handlers + fixtures from `__tests__/shared/handlers`. Call `mockedAxios(AxiosInstance)` inside tests before dispatching thunks.
- **Test store:** `__tests__/shared/store.js` builds a fully wired RTK store (same reducers + middleware). Use it for slice/thunk/component tests to mimic production behavior.
- **Coverage expectations:**  
  - Components/containers: render via `@testing-library/react-native`, assert navigation or form behavior.  
  - Thunks: verify happy path, validation errors, offline/temp-id scenarios.  
  - Helpers/functions: pure unit tests in `__tests__/functions` & `__tests__/helpers`.  
  - Integration: `__tests__/integration` handles navigation/deep linking stories.  
  - Shared examples (`__tests__/shared/sharedExamples.js`) enforce redirect/auth patterns.

## 6. Patterns to Follow

- Normalize everything (`byId` + arrays) and keep derived data in selectors under `redux/selectors`.
- Drive all side effects through thunks or services; UI components stay declarative.
- Persist user-facing forms separately (`redux/slices/*Form`) so they can survive navigation and offline mode.
- Use global helpers (`__helpers/asyncStorageFunctions`, `__hooks/useLocale`, `__hooks/useCopilotEvents`) instead of reimplementing AsyncStorage access or Copilot logic.
- When adding timers, register them through `timers` slice + `TimersController`.
- When integrating a new API:
  1. Add request function in `services`.  
  2. Wrap it with `NewErrorsHandler`.  
  3. Create thunk in `redux/thunks`.  
  4. Handle states in relevant slice + tests using mocked axios fixture.
- Purchases: always go through `purchasePackage` thunk (configures RevenueCat with Expo `Constants.expoConfig.extra.revenueCatApiKey`, logs analytics event, returns normalized subscription list).
- using internationalization i18n with three languages - en, ru, th.
- Use tests broadly.

## 7. Things to Avoid

- Direct `axios`/`fetch` usage outside `services` (breaks auth, dedupe, offline guard, error format).
- Mutating redux state outside slices, or storing non-serializable data (DOM nodes, promises). If unavoidable (timers), keep them in dedicated slices with middleware to clean up.
- Adding global listeners anywhere except `App.jsx`.
- Skipping tests for new thunks/services; shared axios mocks make backend-free testing easy.
- Reusing temp IDs without reconciling them after server response; pending queues rely on consistent ID replacement.
- Hardcoding strings for navigation targets; import from shared helpers if a redirect is needed (e.g., `redirectToPaywall`).

---
Document version: 2025‑12‑04. Keep this file between 100–200 lines; expand only when project-wide practices change.

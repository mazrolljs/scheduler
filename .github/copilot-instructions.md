## Quick context for AI code contributors

This is an Expo React Native app using the `expo-router` file-based routing system. The app code lives in the `app/` directory. Key runtime wiring and patterns you should know before editing:

- Entry/main: `package.json` uses `expo-router/entry` as the app entry.
- File-based routing: add screens by creating files under `app/` (e.g. `app/auth/SignIn.jsx`, `app/drawer/screens/user/ProfileScreen.jsx`). See `src/app/_layout.jsx` which wraps the whole UI in the `UserProvider`.
- Global layout: `src/app/_layout.jsx` wraps the app with `UserProvider` and the `Stack` navigator.

## Authentication & user data

- Firebase is used for auth and Firestore. See `src/services/firebaseConfig.js` for initialization (exports: `app`, `auth`, `db`, `rtdb`).
- Auth state: `src/context/AuthContext.jsx` uses `onAuthStateChanged` and loads user record from Firestore (`users` collection). Use the `useUser()` hook to read `{ user, role, loading }`.
- Persistence: auth uses React Native AsyncStorage via `getReactNativePersistence` — be careful when changing auth flows.

## Data access patterns

- Utilities that talk to Firestore are in `src/utils/utils.js` (examples: `generateNextEmpId`, `fetchLocations`). They use `firebase/firestore` imports via dynamic requires in some functions — keep functions async and avoid duplicating Firestore setup.

## Styling & layout

- Tailwind (NativeWind) is enabled. See `tailwind.config.js` and `global.css`. Use Tailwind classes in JSX; avoid adding global CSS unless necessary.

## Scripts & common commands

- Start dev server (clear cache): `npm start`  (runs `expo start -c`).
- Run on Android emulator/device: `npm run android` (runs `expo run:android`).
- Run on iOS simulator/device: `npm run ios`.
- Web preview: `npm run web`.
- Reset starter project (moves starter app to `app-example`): `npm run reset-project`.
- Linting: `npm run lint` (uses Expo lint config).

## Conventions & patterns to follow

- File organization: primary app code under `app/` (routes), shared context under `src/context`, services under `src/services`, and utilities under `src/utils`.
- Routing: prefer route files in `app/` over manually wiring Stack screens. When adding nested navigators, follow existing structure under `app/drawer/` and `(tabs)` directories.
- Auth guard: components that need user data should use `useUser()` and respect the `loading` flag.
- Firestore reads/writes: prefer helper functions in `src/utils/utils.js` to keep Firestore access consistent.

## Safety and secrets

- `src/services/firebaseConfig.js` contains Firebase config values (API key, etc.). Do not commit new secrets. If you need to change configuration, ask the repo owner or create a new environment configuration and document it.

## Where to look for examples

- Layout and provider: `src/app/_layout.jsx`
- Auth and user hook: `src/context/AuthContext.jsx`
- Firebase wiring: `src/services/firebaseConfig.js`
- Useful helpers: `src/utils/utils.js` (time generators, ID generator, Firestore fetches)
- Routes & screens: `src/app/drawer/screens/*`, `src/app/auth/*`

## Quick editing checklist for PRs

1. Run `npm start` and reproduce the issue locally (pick a platform: web, iOS, or Android).
2. If touching auth or database code, test sign-in flow and at least one Firestore read/write.
3. Keep UI changes consistent with Tailwind classes and existing layout components (see `src/app/assets/components/`).
4. Run `npm run lint` before committing.

If anything here is unclear or you need a repo-specific rule added, please open an issue or ask the maintainer for clarification.

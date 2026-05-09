# AGENTS.md

## Dev commands
- `yarn` — install dependencies
- `quasar dev` — start dev server (not `npm run dev`)
- `quasar build` — production build
- `yarn run lint` — lint files
- No tests configured (`test` script exits 0)

## Framework
- Quasar CLI (Vue 3 + TypeScript)
- Hash router mode (`vueRouterMode: 'hash'`) — URLs include `#`
- `quasar.conf.js` is the source of truth for boot order, plugins, and env vars

## API
- Base URL from `process.env.API` (dotenv loaded in quasar.conf.js)
- Default: `http://localhost:3000/api/`
- `.env.local` overrides `.env` for local dev

## Boot order
Files in `src/boot/` are loaded sequentially: `i18n → http → storage → message → modal → auth`
The `http` boot exposes `$http` globally (get/post/put/patch/delete/convertQuery).

## Routes
- `/login` — auth page
- `/treasury/*` — treasury module
- `/secretary/*` — secretary module
- All other routes use `MainLayout.vue`

## Lint
- Extends `plugin:@typescript-eslint/recommended` + `plugin:vue/vue3-essential` + `standard`
- `vue/multi-word-component-names` is **off** — single-word component names are allowed
- `@typescript-eslint/no-unused-vars` is `error`, `no-unused-vars` is `off`

## TypeScript
- Extends `@quasar/app/tsconfig-preset`
- `allowJs: false` implied by the preset

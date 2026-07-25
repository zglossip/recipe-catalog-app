# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

Requires Node 21. Install with `npm ci`.

| Command | Purpose |
| --- | --- |
| `npm run dev` | Dev server on `http://localhost:8081` (`dev:container` binds `0.0.0.0`) |
| `npm run build` | `vue-tsc` typecheck, then `vite build` — typecheck only runs here, not in `dev` |
| `npm run test:unit` | Vitest in watch mode |
| `npm run lint` | ESLint with `--fix` |
| `npm run format` | Prettier write (no config file — defaults) |
| `npm run storybook` | Storybook on `http://localhost:6006` |
| `npm run mock:api` | json-server on port 3001 from `db.json` + `routes.json` |
| `npm run chromatic` | Publish Storybook to Chromatic |

Single test file / single test:

```bash
npx vitest run tests/unit/services/apiService.spec.ts
npx vitest run -t "fetchRecipes handles success"
```

### Backend

The app needs a REST API ([food-history-api](https://github.com/zglossip/food-history-api)) at `VITE_BACKEND_BASE`, read in `src/services/constants.ts`. For local work without it, run `npm run mock:api` and keep `VITE_BACKEND_BASE=http://localhost:3001` (see `.env.development`). `CHROMATIC_PROJECT_TOKEN` in `.env` is needed only for `npm run chromatic`.

Path aliases: `@` → `src/`, `@tests` → `tests/` (defined in `vite.config.ts`, which also holds the Vitest config — there is no separate vitest config file).

## Architecture

Vue 3 + TypeScript SPA, `<script setup>` throughout, PrimeVue 4 components with a custom preset in `src/style/theme.ts`, Tailwind 4 via the Vite plugin. No Pinia/Vuex — state lives in composables.

### Component / service split (the central pattern)

Nearly every component folder holds three files, e.g. `viewRecipeContainer/`:

- `ViewRecipeContainer.vue` — template + wiring only
- `viewRecipeContainerService.ts` — **all** state and logic, as a `useXService()` composable
- `ViewRecipeContainer.stories.ts` — Storybook

The service exports a `Symbol()` named `INJECTION_KEY`, a `XService` interface, and a `useXService()` factory returning that interface. The component consumes it through an inject-with-default seam:

```ts
const { recipe, onEditHeader } = inject(INJECTION_KEY, useViewRecipeContainerService)(props.id);
```

At runtime nothing provides the key, so the real service is used. Stories `provide()` a stub implementation instead, which is how components are rendered in isolation without a backend. Stub factories are **exported from the stories file** (`stubRecipeService`, `stubIngredientCardService`, …) so a parent's story can compose its children's stubs — see `ViewRecipeContainer.stories.ts`.

Preserve this three-part shape when adding components. Logic in the `.vue` file is the thing to avoid; it becomes untestable and unstubabble.

### Testing

Unit tests live in `tests/unit/`, mirroring the `src/` path, and target **service files, not components** — services are called directly as plain functions and their returned refs asserted. There are no component mount tests; visual coverage is Storybook/Chromatic's job.

Convention: `vi.mock("@/services/apiService")` and `vi.mock("vue-router")` at the top of the file (hoisted above imports), then a local `setup(options)` helper that wires mock return values and returns `{ service, ...handles }`. Fixtures come from `tests/data/defaults.ts` (`generateRecipe`, `generateIngredient` — override-taking factories).

### Data flow

`src/services/apiService.ts` is the only place axios is used. Every call returns a discriminated `ApiResult<T>` (`{ ok: true, data }` | `{ ok: false, error }`) rather than throwing — callers branch on `result.ok`, and errors have already been surfaced as a toast by `handleError`. Keep that contract when adding endpoints.

`uploaded` arrives from the API as a string and is converted to a `Date` by `mapRecipe` on the way in; any new fetch returning a recipe must run through it.

`src/composables/useToast.ts` holds a module-level `reactive` singleton — importing `useToast()` anywhere shares one toast state.

### Routing

Routes are in `src/router/index.ts`, all lazy-imported. Create and edit share the same view components, distinguished by whether an `:id` param is present: `/recipe/create/ingredients` vs `/recipe/edit/:id/ingredients`. Views take `id` as a **string** prop (`props: true`) and convert to `Number` when passing down, with `undefined` meaning "create mode". Services must handle `id?: number` accordingly.

Layering is `views/` → `components/` → services. `src/components/` is grouped by feature area: `common/`, `browse/`, `viewRecipe/`, `createEdit/`.

## Notes

- The project was migrated off Ionic/Capacitor onto PrimeVue; it is a responsive web app, not a native shell. Do not reintroduce `ion-*` components or Capacitor plugins.
- `basePageService.js` is the one service written in JavaScript rather than TypeScript — a deliberate choice, not leftover from the migration, and not a cleanup task. Consequence: it is the only service that exports no `XService` interface, so its `inject` seam is untyped and story stubs for it are unchecked.
- ESLint has `@typescript-eslint/no-explicit-any` disabled, and stories lean on `args: any`.

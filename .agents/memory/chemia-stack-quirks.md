---
name: CHEMIA stack quirks
description: Non-obvious constraints and patterns in the CHEMIA React+Vite + Express API project
---

## esbuild cannot resolve `zod/v4`

Do NOT use `import { z } from "zod/v4"` in `artifacts/api-server`. The esbuild bundler fails
to resolve the subpath export. Use `import { z } from "zod"` or `from "@workspace/api-zod"` instead.

**Why:** The api-server uses esbuild (CJS bundle) which doesn't handle zod v4's package.json subpath
exports. This only affects the server bundle — the frontend (Vite) handles it fine.

**How to apply:** Whenever adding Zod validation to any api-server route or lib, use `zod` not `zod/v4`.

---

## Accessing 422 error bodies in the frontend (ApiError pattern)

Generated hooks return `ApiError<T>` on error. To read a typed 422 body (e.g. `PerfilFueraMVP`):

```ts
const fueraMVP =
  mutation.error?.data &&
  typeof mutation.error.data === "object" &&
  "compuestosMVP" in (mutation.error.data as object)
    ? (mutation.error.data as PerfilFueraMVP)
    : null;
```

Check for a discriminating key rather than using instanceof or status code, because the error type
is a union (e.g. `ErrorResponse | PerfilFueraMVP`).

**Why:** Orval generates `ErrorType<T>` = `ApiError<T>`. The `.data` property holds the parsed
response body. Status code is also available via `.status` if needed.

---

## Tailwind dynamic class purging

Never generate Tailwind class names dynamically (e.g. `` `text-${color}-400` ``).
Always use a static lookup object with full literal class strings so Tailwind's content scanner
picks them up at build time.

**How to apply:** In any file that maps a runtime string to Tailwind classes, write a `const C = { ... }`
record with full literal strings (e.g. `"text-cyan-400"`, `"bg-cyan-500/10"`).

---

## Codegen workflow

After modifying `lib/api-spec/openapi.yaml`, run:
```
pnpm --filter @workspace/api-spec run codegen
```
This generates React Query hooks + Zod schemas. The OpenAPI `info.title` MUST stay `"Api"`
(it controls generated filenames — changing it breaks all import paths).

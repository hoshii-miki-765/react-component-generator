# Server Module Instructions

## Module Context

This Bun server proxies provider requests and converts generated responses into code executable by the client preview. It depends on pure fallback and normalization helpers so their behavior can be unit-tested separately.

## Constraints

- Use the built-in `fetch` and `Bun.serve` patterns already used in `index.ts`; do not add a client-visible provider SDK or move provider calls into `src/`.
- Return CORS headers for every API response path, including validation and error responses, as established by `server/index.ts:51-55,142-217`.
- Keep `generator.ts` and `fallback.ts` free of server side effects; their isolated tests rely on this boundary.

## Testing Strategy

- Run `bun run test -- server/generator.test.ts` after changing code normalization.
- Run `bun run test -- server/fallback.test.ts` after changing retry behavior.
- Run `bun run test` when route behavior or shared server contracts change.

## Local Golden Rules

- Do not bypass `stripCodeFences` or `ensureRenderCall`; tests cover fenced input, existing render calls, `const` declarations, and function declarations in `server/generator.test.ts:4-39`.
- Maintain ordered fallback semantics: return the first successful model result and throw the final failure only after all attempts, as implemented in `server/fallback.ts:3-18` and tested in `server/fallback.test.ts:4-42`.
- Do not return resolved API keys. Environment-key availability is intentionally reduced to booleans in `GET /api/config` at `server/index.ts:148-155`.
- Validate both the provider key and prompt before making a provider request (`server/index.ts:167-181`).

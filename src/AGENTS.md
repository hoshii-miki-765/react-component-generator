# Client Module Instructions

## Module Context

This React client collects provider and prompt input, requests generated code from the local API, and displays it in a react-live preview or code view. Request lifecycle state is centralized in `useComponentGenerator`.

## Constraints

- Persist the user-entered API key in browser `localStorage` so it survives refreshes. The hook sends it only in the `/api/generate` request body when supplied; never expose environment API-key values to storage or API responses.
- Preserve generated component ordering: successful results are prepended in `hooks/useComponentGenerator.ts:35-43`.
- Keep `LiveProvider` in `noInline` mode. Server normalization supplies its required `render(...)` call (`components/LivePreview.tsx:14`).

## Testing Strategy

- Run `bun run test -- src/components/PromptInput.test.tsx` when changing prompt submission or loading states.
- Test user-visible behavior with Testing Library roles and user events, matching the existing test style in `components/PromptInput.test.tsx:8-29`.

## Local Golden Rules

- Do not allow concurrent generation through new controls: `isLoading` guards the hook lifecycle and disables prompt submission and regeneration (`hooks/useComponentGenerator.ts:18-46`, `components/PromptInput.tsx:22-23,53`, `components/ComponentCard.tsx:42`).
- Keep API failure text in hook state and let `App` render it as the shared error banner (`hooks/useComponentGenerator.ts:44-46`, `App.tsx:135-139`).
- Preserve the provider-change key reset in `App.tsx:41-44` so a key from one provider is not reused for another.

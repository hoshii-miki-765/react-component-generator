# Agent Instructions

## Operational Commands

- Use Bun for dependency and script operations; do not substitute npm, yarn, or pnpm.
- `bun run dev` starts the Bun API server and Vite client together.
- `bun run build` type-checks and produces the production client bundle.
- `bun run lint` checks TypeScript and React lint rules.
- `bun run test` runs all Vitest tests.
- Run the narrow test file while changing a tested utility, then run `bun run test` before completing a multi-file change.

## Golden Rules

- Never expose environment API-key values to the client. `/api/config` returns only booleans at `server/index.ts:148-155`; preserve that response shape.
- Keep provider keys resolved on the server through `resolveApiKey` (`server/index.ts:59-65`) and never add them to client state, logs, or API responses.
- Preserve the generated-code normalization chain `ensureRenderCall(stripCodeFences(text))` at `server/index.ts:188`. The live preview requires a `render(...)` call (`server/generator.ts:13-21`).
- Preserve Google model fallback rather than calling a model directly: `callGoogle` delegates to `withModelFallback` at `server/index.ts:134-135`; retry ordering and final-error behavior are tested in `server/fallback.test.ts:4-42`.
- Keep error handling split by recoverable provider conditions: 503 and 429 return dedicated Korean messages before the generic 500 handler (`server/index.ts:192-211`).
- Do not remove UI loading guards. The hook owns request state (`src/hooks/useComponentGenerator.ts:14-46`), and both the prompt submit path and regeneration control disable concurrent requests (`src/components/PromptInput.tsx:22,53`, `src/components/ComponentCard.tsx:42`).

## Project Context

This application turns a natural-language request into a self-contained React component, then renders and exposes the generated code locally. Stack: React 19, TypeScript, Vite, Bun, Vitest, react-live.

## Standards and References

- Keep generated-component code as plain JavaScript with inline styles, following the server system prompt rather than adding imports or TypeScript syntax.
- Add or update focused tests for pure server utilities and interactive prompt behavior; these are the established tested boundaries.
- Use Korean Conventional Commit messages in the form `feat: 요약`, `fix: 요약`, `refactor: 요약`, or `chore: 요약`.
- When code invalidates an instruction here, update this file or propose the update in the same change.

## TDD Rule

> **이 규칙은 Rigid — 상황에 맞게 변형하지 마라.**

이 섹션은 전역 기본값(fallback)이다. 하위 디렉터리의 `AGENTS.md`에 별도 TDD 규칙이 있으면 **그 규칙을 우선 적용**한다.

### 적용 기준

- **TDD 필수:** 비즈니스 로직, API, 유틸리티, 버그 수정
- **TDD 불필요:** 타입 정의, 설정 파일, 순수 UI, SQL

### RED-GREEN-REFACTOR

1. **RED:** 하나의 동작마다 하나의 테스트를 작성한다. 반드시 실행해 실패를 확인하며, 실패 이유는 **기능 미구현**이어야 한다.
2. **GREEN:** 테스트를 통과시키는 최소한의 코드만 작성한다. **YAGNI**를 지키고, 신규 및 기존 테스트가 모두 통과하는지 확인한다.
3. **REFACTOR:** 중복 제거, 이름 개선, 헬퍼 추출만 수행한다. green 상태를 유지하고, **새 동작을 추가하지 않는다.**
4. **반복:** 다음 동작에 대한 RED로 돌아간다.

### 삭제 강제 규칙

테스트보다 프로덕션 코드를 먼저 작성했다면 **즉시 삭제**하고 RED부터 다시 시작한다. "참고용"으로 남기는 것도 **금지**한다.

### 변명 차단표

| 변명 | 반론 |
| --- | --- |
| 너무 단순해서 테스트 불필요 | 단순한 동작도 요구사항을 고정하고 회귀를 막아야 한다. |
| 나중에 추가하겠다 | 나중은 보장되지 않는다. 지금 RED를 작성한다. |
| 시간이 없다 | 테스트 없는 수정은 재작업과 회귀 비용을 키운다. |
| 삭제하면 낭비 | 잘못된 순서의 코드는 학습 비용일 뿐, 남길 이유가 없다. |
| 프로토타입이다 | 프로토타입도 검증 가능한 동작을 빠르게 반복해야 한다. |

## Context Map

- **[Bun API routes, providers, or generated-code handling](./server/AGENTS.md)** — Server-only key handling, provider fallback, and code normalization.
- **[React UI, state, preview, or styling](./src/AGENTS.md)** — Client request flow and react-live rendering constraints.

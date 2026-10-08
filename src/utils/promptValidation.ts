export const MAX_PROMPT_LENGTH = 500;

type PromptValidationResult =
  | { isValid: true }
  | { isValid: false; error: string };

export function validatePromptLength(prompt: string): PromptValidationResult {
  if (prompt.length > MAX_PROMPT_LENGTH) {
    return {
      isValid: false,
      error: '프롬프트는 500자 이하로 입력해주세요.',
    };
  }

  return { isValid: true };
}

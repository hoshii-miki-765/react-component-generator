import { describe, expect, it } from 'vitest';
import { validatePromptLength } from './promptValidation';

describe('validatePromptLength', () => {
  it('500자 이하는 유효하다', () => {
    expect(validatePromptLength('가'.repeat(500))).toEqual({ isValid: true });
  });

  it('500자를 초과하면 오류 메시지를 반환한다', () => {
    expect(validatePromptLength('가'.repeat(501))).toEqual({
      isValid: false,
      error: '프롬프트는 500자 이하로 입력해주세요.',
    });
  });
});

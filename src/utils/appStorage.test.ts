import { describe, expect, it } from 'vitest';
import { loadAppState, saveAppState } from './appStorage';

function createStorage() {
  const values = new Map<string, string>();

  return {
    getItem: (key: string) => values.get(key) ?? null,
    setItem: (key: string, value: string) => values.set(key, value),
  };
}

describe('appStorage', () => {
  it('API 키, Provider, 프롬프트 히스토리, 컴포넌트를 저장하고 복원한다', () => {
    const storage = createStorage();
    const state = {
      apiKey: 'test-api-key',
      provider: 'anthropic' as const,
      promptHistory: ['프로필 카드'],
      components: [
        {
          id: 'component-1',
          prompt: '프로필 카드',
          code: 'render(<div />);',
          createdAt: new Date('2026-01-01T00:00:00.000Z'),
        },
      ],
    };

    saveAppState(state, storage);

    expect(loadAppState(storage)).toEqual(state);
  });

  it('손상된 저장값은 기본 상태로 복원한다', () => {
    const storage = createStorage();
    storage.setItem('react-component-generator:app-state', '{invalid json');

    expect(loadAppState(storage)).toEqual({
      apiKey: '',
      provider: 'google',
      promptHistory: [],
      components: [],
    });
  });
});

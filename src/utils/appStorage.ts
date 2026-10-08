import type { GeneratedComponent, Provider } from '../types';

const APP_STATE_KEY = 'react-component-generator:app-state';

interface AppState {
  apiKey: string;
  provider: Provider;
  promptHistory: string[];
  components: GeneratedComponent[];
}

interface StorageLike {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
}

const DEFAULT_APP_STATE: AppState = {
  apiKey: '',
  provider: 'google',
  promptHistory: [],
  components: [],
};

function isProvider(value: unknown): value is Provider {
  return value === 'anthropic' || value === 'google';
}

function parseComponent(value: unknown): GeneratedComponent | null {
  if (!value || typeof value !== 'object') {
    return null;
  }

  const component = value as Record<string, unknown>;
  const createdAt = new Date(String(component.createdAt));

  if (
    typeof component.id !== 'string' ||
    typeof component.prompt !== 'string' ||
    typeof component.code !== 'string' ||
    Number.isNaN(createdAt.getTime())
  ) {
    return null;
  }

  return { id: component.id, prompt: component.prompt, code: component.code, createdAt };
}

export function loadAppState(storage: StorageLike = window.localStorage): AppState {
  try {
    const stored = storage.getItem(APP_STATE_KEY);
    if (!stored) {
      return DEFAULT_APP_STATE;
    }

    const value = JSON.parse(stored) as Record<string, unknown>;
    const components = Array.isArray(value.components)
      ? value.components.map(parseComponent).filter((component): component is GeneratedComponent => component !== null)
      : [];

    return {
      apiKey: typeof value.apiKey === 'string' ? value.apiKey : '',
      provider: isProvider(value.provider) ? value.provider : 'google',
      promptHistory: Array.isArray(value.promptHistory)
        ? value.promptHistory.filter((prompt): prompt is string => typeof prompt === 'string')
        : [],
      components,
    };
  } catch {
    return DEFAULT_APP_STATE;
  }
}

export function saveAppState(state: AppState, storage: StorageLike = window.localStorage) {
  storage.setItem(APP_STATE_KEY, JSON.stringify(state));
}

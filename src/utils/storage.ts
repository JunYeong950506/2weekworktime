import dayjs from 'dayjs';

import { APP_STORAGE_KEY } from '../constants';
import { AppState, PersistedAppState } from '../types';

const APP_STORAGE_KEYS = [APP_STORAGE_KEY] as const;

function isValidObject(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

function parsePersistedState(raw: unknown): PersistedAppState | null {
  if (!isValidObject(raw)) {
    return null;
  }

  const periods = raw.periods;
  const selectedPeriodId = raw.selectedPeriodId;
  const savedAt = raw.savedAt;

  if (!Array.isArray(periods)) {
    return null;
  }

  if (!(typeof selectedPeriodId === 'string' || selectedPeriodId === null)) {
    return null;
  }

  if (typeof savedAt !== 'string') {
    return null;
  }

  return {
    periods: periods as AppState['periods'],
    selectedPeriodId,
    savedAt,
  };
}

export function loadAppState(): PersistedAppState | null {
  try {
    const text = localStorage.getItem(APP_STORAGE_KEY);

    if (!text) {
      return null;
    }

    const parsed = JSON.parse(text) as unknown;
    return parsePersistedState(parsed);
  } catch {
    return null;
  }
}

export function saveAppState(state: AppState): string {
  const savedAt = dayjs().toISOString();

  const payload: PersistedAppState = {
    ...state,
    savedAt,
  };

  localStorage.setItem(APP_STORAGE_KEY, JSON.stringify(payload));

  return savedAt;
}

export function hasAppStorageData(): boolean {
  try {
    return APP_STORAGE_KEYS.some((key) => localStorage.getItem(key) !== null);
  } catch {
    return false;
  }
}

export function clearAllAppStorage(): void {
  try {
    APP_STORAGE_KEYS.forEach((key) => {
      localStorage.removeItem(key);
    });
  } catch {
    // no-op
  }
}
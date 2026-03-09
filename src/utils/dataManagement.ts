import { AppState } from '../types';

export function createEmptyAppState(): AppState {
  return {
    selectedPeriodId: null,
    periods: [],
  };
}

export function deleteCurrentPeriod(state: AppState): AppState {
  const currentId = state.selectedPeriodId;

  if (!currentId) {
    return state;
  }

  const selectedIndex = state.periods.findIndex((period) => period.id === currentId);
  if (selectedIndex < 0) {
    return state;
  }

  const remainingPeriods = state.periods.filter((period) => period.id !== currentId);

  if (remainingPeriods.length === 0) {
    return createEmptyAppState();
  }

  let nextSelectedPeriodId: string | null = null;

  if (selectedIndex < remainingPeriods.length) {
    nextSelectedPeriodId = remainingPeriods[selectedIndex].id;
  } else {
    nextSelectedPeriodId = remainingPeriods[remainingPeriods.length - 1].id;
  }

  return {
    selectedPeriodId: nextSelectedPeriodId,
    periods: remainingPeriods,
  };
}
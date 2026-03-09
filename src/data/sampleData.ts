import { AppState } from '../types';
import { recalculateRecords } from '../utils/calculations';
import {
  buildDefaultPeriodLabel,
  copyRecordsWithNewDate,
  createPeriod,
  ensureUniquePeriodId,
} from '../utils/period';

const sampleStartDate = '2026-03-02';

export function createSampleState(): AppState {
  const baseLabel = buildDefaultPeriodLabel(sampleStartDate);
  const id = ensureUniquePeriodId(baseLabel, []);
  const records = copyRecordsWithNewDate(sampleStartDate, [], false);

  records[0] = {
    ...records[0],
    clockIn: '09:00',
    clockOut: '18:30',
    claimedOtMinutes: 20,
  };

  records[1] = {
    ...records[1],
    clockIn: '09:10',
    clockOut: '18:00',
    claimedOtMinutes: 0,
  };

  records[2] = {
    ...records[2],
    clockIn: '09:00',
    clockOut: '19:10',
    claimedOtMinutes: 60,
  };

  records[3] = {
    ...records[3],
    isHoliday: true,
  };

  records[4] = {
    ...records[4],
    clockIn: '08:50',
    clockOut: '17:40',
    claimedOtMinutes: 0,
  };

  const recalculated = recalculateRecords(records).records;

  const samplePeriod = createPeriod({
    id,
    label: baseLabel,
    startDate: sampleStartDate,
    records: recalculated,
  });

  return {
    selectedPeriodId: samplePeriod.id,
    periods: [samplePeriod],
  };
}


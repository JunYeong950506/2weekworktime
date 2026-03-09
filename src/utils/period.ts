import dayjs from 'dayjs';

import { DAYS_PER_PERIOD } from '../constants';
import { DayRecord, Period } from '../types';
import { recalculateRecords } from './calculations';

function sanitizePeriodId(label: string): string {
  const compact = label
    .trim()
    .replace(/\s+/g, '_')
    .replace(/[^0-9A-Za-z가-힣_-]/g, '');

  if (compact.length > 0) {
    return compact;
  }

  return dayjs().format('YYYYMMDD_HHmmss');
}

export function buildDefaultPeriodLabel(startDate: string): string {
  const date = dayjs(startDate);
  const segment = date.date() <= 14 ? '1구간' : '2구간';

  return `${date.format('YYYY_MM')}_${segment}`;
}

export function ensureUniquePeriodId(
  candidateLabel: string,
  existingIds: string[],
): string {
  const base = sanitizePeriodId(candidateLabel);
  const used = new Set(existingIds);

  if (!used.has(base)) {
    return base;
  }

  let suffix = 2;
  while (used.has(`${base}_${suffix}`)) {
    suffix += 1;
  }

  return `${base}_${suffix}`;
}

export function createRecordsFromStartDate(startDate: string): DayRecord[] {
  const baseDate = dayjs(startDate).startOf('day');

  return Array.from({ length: DAYS_PER_PERIOD }, (_, index) => ({
    date: baseDate.add(index, 'day').format('YYYY-MM-DD'),
    isHoliday: false,
    clockIn: '',
    clockOut: '',
    workMinutes: null,
    regularMinutes: null,
    overtimeMinutes: null,
    recommendedOtMinutes: null,
    claimedOtMinutes: 0,
    earlyLeaveBalanceMinutes: null,
  }));
}

export function copyRecordsWithNewDate(
  startDate: string,
  sourceRecords: DayRecord[],
  copyValues: boolean,
): DayRecord[] {
  const newRecords = createRecordsFromStartDate(startDate);

  if (!copyValues) {
    return newRecords;
  }

  const merged = newRecords.map((record, index) => ({
    ...record,
    isHoliday: sourceRecords[index]?.isHoliday ?? false,
    clockIn: sourceRecords[index]?.clockIn ?? '',
    clockOut: sourceRecords[index]?.clockOut ?? '',
    claimedOtMinutes: sourceRecords[index]?.claimedOtMinutes ?? 0,
  }));

  return recalculateRecords(merged).records;
}

export function rebaseRecordDates(
  startDate: string,
  records: DayRecord[],
): DayRecord[] {
  const base = createRecordsFromStartDate(startDate);
  const merged = base.map((record, index) => ({
    ...record,
    isHoliday: records[index]?.isHoliday ?? false,
    clockIn: records[index]?.clockIn ?? '',
    clockOut: records[index]?.clockOut ?? '',
    claimedOtMinutes: records[index]?.claimedOtMinutes ?? 0,
  }));

  return recalculateRecords(merged).records;
}

interface CreatePeriodInput {
  id: string;
  label: string;
  startDate: string;
  records: DayRecord[];
}

export function createPeriod(input: CreatePeriodInput): Period {
  const now = dayjs().toISOString();

  return {
    id: input.id,
    label: input.label,
    startDate: input.startDate,
    records: input.records,
    createdAt: now,
  };
}
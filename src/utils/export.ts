import dayjs from 'dayjs';

import { Period, SummaryValues } from '../types';
import {
  formatDateCell,
  formatMinutesAsClock,
  formatSignedMinutesAsClock,
} from './time';

function escapeCsv(value: string): string {
  if (value.includes(',') || value.includes('"') || value.includes('\n')) {
    return `"${value.replace(/"/g, '""')}"`;
  }

  return value;
}

function summaryRows(summary: SummaryValues): string[][] {
  return [
    ['필수 근무시간', formatMinutesAsClock(summary.requiredMinutes)],
    ['남은 근무시간', formatMinutesAsClock(summary.remainingMinutes)],
    ['추가 가능 잔업시간', formatMinutesAsClock(summary.additionalOvertimeAvailableMinutes)],
    ['조기퇴근 가능시간', formatSignedMinutesAsClock(summary.earlyLeaveAvailableMinutes)],
    ['야근결재 합계', formatMinutesAsClock(summary.overtimeApprovalTotalMinutes)],
  ];
}

export function buildPeriodCsv(period: Period, summary: SummaryValues): string {
  const header = [
    '날짜',
    '공휴일',
    '출근시간',
    '퇴근시간',
    '근무시간',
    '정규 업무시간',
    '추가 근무시간',
    '권장 야근결재',
    '실제 야근결재(분)',
    '조기퇴근 적립/부족',
  ];

  const rows = period.records.map((record) =>
    [
      formatDateCell(record.date),
      record.isHoliday ? 'Y' : 'N',
      record.clockIn,
      record.clockOut,
      formatMinutesAsClock(record.workMinutes),
      formatMinutesAsClock(record.regularMinutes),
      formatMinutesAsClock(record.overtimeMinutes),
      formatMinutesAsClock(record.recommendedOtMinutes),
      String(record.claimedOtMinutes),
      formatSignedMinutesAsClock(record.earlyLeaveBalanceMinutes),
    ].map(escapeCsv),
  );

  const lines = [
    [escapeCsv(`구간명: ${period.label}`)],
    [escapeCsv(`시작일: ${period.startDate}`)],
    [escapeCsv(`내보낸 시각: ${dayjs().format('YYYY-MM-DD HH:mm:ss')}`)],
    [],
    header,
    ...rows,
    [],
    ['요약', '값'],
    ...summaryRows(summary).map((line) => line.map(escapeCsv)),
  ];

  return lines.map((line) => line.join(',')).join('\n');
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([`\uFEFF${csv}`], {
    type: 'text/csv;charset=utf-8;',
  });

  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

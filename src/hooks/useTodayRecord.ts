import { useMemo } from 'react';
import dayjs from 'dayjs';

import { DayRecord } from '../types';

export interface TodayRecordTarget {
  index: number;
  mode: 'today' | 'closest';
}

export function useTodayRecord(records: DayRecord[]): TodayRecordTarget | null {
  return useMemo(() => {
    if (records.length === 0) {
      return null;
    }

    const today = dayjs().startOf('day');
    const todayIso = today.format('YYYY-MM-DD');
    const todayIndex = records.findIndex((record) => record.date === todayIso);

    if (todayIndex >= 0) {
      return {
        index: todayIndex,
        mode: 'today',
      };
    }

    let closestIndex = 0;
    let closestDistance = Number.POSITIVE_INFINITY;

    records.forEach((record, index) => {
      const recordDate = dayjs(record.date).startOf('day');
      if (!recordDate.isValid()) {
        return;
      }

      const distance = Math.abs(recordDate.diff(today, 'day'));
      if (distance < closestDistance) {
        closestDistance = distance;
        closestIndex = index;
      }
    });

    return {
      index: closestIndex,
      mode: 'closest',
    };
  }, [records]);
}
import dayjs from 'dayjs';
import Holidays from 'date-holidays';

const krHolidays = new Holidays('KR');

export function isKoreanPublicHoliday(dateIso: string): boolean {
  const date = dayjs(dateIso);
  const localDate = new Date(date.year(), date.month(), date.date());

  return Boolean(krHolidays.isHoliday(localDate));
}
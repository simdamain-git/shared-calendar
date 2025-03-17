import dayjs from 'dayjs';

export class DateUtils {
  static compareDates(date1: Date, date2: Date): boolean {
    return date1.getDate() === date2.getDate() && date1.getMonth() === date2.getMonth();
  }

  static findClosestFutureDate(dates: Date[], targetDate: Date): Date | null {
    const targetDayMonth = dayjs(targetDate).format('MM-DD');
    const futureDates = dates
      .map(date => dayjs(date))
      .filter(date => date.format('MM-DD') >= targetDayMonth)
      .sort((a, b) => a.diff(b));

    return futureDates.length > 0 ? futureDates[0].toDate() : null;
  }
}

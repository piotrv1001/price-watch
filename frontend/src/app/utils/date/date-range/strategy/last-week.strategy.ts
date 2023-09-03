import { DateRangeStrategy } from './date-range.strategy';

export class LastWeekStrategy implements DateRangeStrategy {

  getStartDate(): Date {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 6);
    return startDate;
  }

  getEndDate(): Date {
    return new Date();
  }
}

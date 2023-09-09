import { DateRangeStrategy } from './date-range.strategy';

export class WeekStrategy implements DateRangeStrategy {

  constructor(private days: number) { }

  getStartDate(): Date {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - this.days);
    return startDate;
  }

  getEndDate(): Date {
    return new Date();
  }
}

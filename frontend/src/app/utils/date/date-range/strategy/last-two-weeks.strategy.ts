import { DateRangeStrategy } from './date-range.strategy';

export class LastTwoWeeksStrategy implements DateRangeStrategy {

  getStartDate(): Date {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 13);
    return startDate;
  }

  getEndDate(): Date {
    return new Date();
  }
}

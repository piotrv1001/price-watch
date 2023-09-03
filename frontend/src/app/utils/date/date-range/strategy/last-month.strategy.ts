import { DateRangeStrategy } from "./date-range.strategy";

export class LastMonthStrategy implements DateRangeStrategy {

  getStartDate(): Date {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 1);
    return startDate;
  }

  getEndDate(): Date {
    return new Date();
  }
}

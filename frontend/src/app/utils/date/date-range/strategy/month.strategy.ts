import { DateRangeStrategy } from "./date-range.strategy";

export class MonthStrategy implements DateRangeStrategy {

  constructor(private months: number) { }

  getStartDate(): Date {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - this.months);
    return startDate;
  }

  getEndDate(): Date {
    return new Date();
  }
}

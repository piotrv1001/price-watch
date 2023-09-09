import { DateRangeStrategy } from "./date-range.strategy";

export class LastTwoMonthsStrategy implements DateRangeStrategy {

  getStartDate(): Date {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - 2);
    return startDate;
  }

  getEndDate(): Date {
    return new Date();
  }
}

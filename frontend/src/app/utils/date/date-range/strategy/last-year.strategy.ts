import { DateRangeStrategy } from "./date-range.strategy";

export class LastYearStrategy implements DateRangeStrategy {
  getStartDate(): Date {
    const startDate = new Date();
    startDate.setFullYear(startDate.getFullYear() - 1);
    return startDate;
  }

  getEndDate(): Date {
    return new Date();
  }
}

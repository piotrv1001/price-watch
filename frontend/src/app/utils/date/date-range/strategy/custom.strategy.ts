import { DateRangeStrategy } from "./date-range.strategy";

export class CustomDateRangeStrategy implements DateRangeStrategy {

  private startDate: Date = new Date();
  private endDate: Date = new Date();

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  setStartDate(startDate: Date): void {
    this.startDate = startDate;
  }

  setEndDate(endDate: Date): void {
    this.endDate = endDate;
  }
}

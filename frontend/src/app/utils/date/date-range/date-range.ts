import { CustomDateRangeStrategy } from "./strategy/custom.strategy";
import { DateRangeStrategy } from "./strategy/date-range.strategy";
import { MonthStrategy } from "./strategy/month.strategy";
import { WeekStrategy } from "./strategy/week.strategy";

export type DateRangeType =
  | 'last-week'
  | 'last-two-weeks'
  | 'last-month'
  | 'last-two-months'
  | 'last-year'
  | 'custom';

export class DateRange {
  dateRangeStrategy: DateRangeStrategy | null = null;

  setDateRangeStrategy(dateRangeType: DateRangeType): void {
    switch (dateRangeType) {
      case 'last-week':
        this.dateRangeStrategy = new WeekStrategy(6);
        break;
      case 'last-two-weeks':
        this.dateRangeStrategy = new WeekStrategy(13);
        break;
      case 'last-month':
        this.dateRangeStrategy = new MonthStrategy(1);
        break;
      case 'last-two-months':
        this.dateRangeStrategy = new MonthStrategy(2);
        break;
      case 'last-year':
        this.dateRangeStrategy = new MonthStrategy(12);
        break;
      case 'custom':
        this.dateRangeStrategy = new CustomDateRangeStrategy();
        break;
      default:
        this.dateRangeStrategy = null;
    }
  }

  getStartDate(): Date {
    return this.dateRangeStrategy?.getStartDate() ?? new Date();
  }

  getEndDate(): Date {
    return this.dateRangeStrategy?.getEndDate() ?? new Date();
  }
}

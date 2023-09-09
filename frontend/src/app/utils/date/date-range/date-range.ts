import { CustomDateRangeStrategy } from "./strategy/custom.strategy";
import { DateRangeStrategy } from "./strategy/date-range.strategy";
import { LastMonthStrategy } from "./strategy/last-month.strategy";
import { LastTwoMonthsStrategy } from "./strategy/last-two-months.strategy";
import { LastTwoWeeksStrategy } from "./strategy/last-two-weeks.strategy";
import { LastWeekStrategy } from "./strategy/last-week.strategy";
import { LastYearStrategy } from "./strategy/last-year.strategy";

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
        this.dateRangeStrategy = new LastWeekStrategy();
        break;
      case 'last-two-weeks':
        this.dateRangeStrategy = new LastTwoWeeksStrategy();
        break;
      case 'last-month':
        this.dateRangeStrategy = new LastMonthStrategy();
        break;
      case 'last-two-months':
        this.dateRangeStrategy = new LastTwoMonthsStrategy();
        break;
      case 'last-year':
        this.dateRangeStrategy = new LastYearStrategy();
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

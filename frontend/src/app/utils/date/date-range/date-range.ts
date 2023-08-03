import { DateUtil } from "../date.util";
import { DateRangeStrategy } from "./strategy/date-range.strategy";
import { LastMonthStrategy } from "./strategy/last-month.strategy";
import { LastWeekStrategy } from "./strategy/last-week.strategy";
import { LastYearStrategy } from "./strategy/last-year.strategy";

export type DateRangeType = 'last-week' | 'last-month' | 'last-year';

export class DateRange {
  dateRangeStrategy: DateRangeStrategy | null = null;

  setDateRangeStrategy(dateRangeType: DateRangeType): void {
    switch (dateRangeType) {
      case 'last-week':
        this.dateRangeStrategy = new LastWeekStrategy();
        break;
      case 'last-month':
        this.dateRangeStrategy = new LastMonthStrategy();
        break;
      case 'last-year':
        this.dateRangeStrategy = new LastYearStrategy();
        break;
      default:
        this.dateRangeStrategy = null;
    }
  }

  getStartDate(): Date {
    if (this.dateRangeStrategy) {
      return this.dateRangeStrategy.getStartDate();
    }
    return new Date();
  }

  getEndDate(): Date {
    if (this.dateRangeStrategy) {
      return this.dateRangeStrategy.getEndDate();
    }
    return new Date();
  }

  getChartLabels(): string[] {
    if (this.dateRangeStrategy) {
      return this.dateRangeStrategy.getChartLabels();
    }
    return DateUtil.WEEK_DAYS;
  }
}

import { DateUtil } from '../../date.util';
import { DateRangeStrategy } from './date-range.strategy';

export class LastWeekStrategy implements DateRangeStrategy {
  getStartDate(): Date {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - 7);
    return startDate;
  }

  getEndDate(): Date {
    return new Date();
  }

  getChartLabels(): string[] {
    return DateUtil.WEEK_DAYS;
  }
}

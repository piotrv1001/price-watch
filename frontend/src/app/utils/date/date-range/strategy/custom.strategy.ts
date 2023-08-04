import { DateUtil } from "../../date.util";
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

  getChartLabels(): string[] {
    const timeRange = this.endDate.getTime() - this.startDate.getTime();
    const oneDay = 24 * 60 * 60 * 1000; // Milliseconds in a day
    const oneWeek = oneDay * 7;
    const oneMonth = oneDay * 30;
    const oneYear = oneDay * 365;
    let timeUnit = 'day';
    if (timeRange > oneYear) {
      timeUnit = 'year';
    } else if (timeRange > oneMonth) {
      timeUnit = 'month';
    } else if(timeRange > oneWeek) {
      timeUnit = 'week';
    } else {
      timeUnit = 'day';
    }
    let labels: string[] = [];
    if (timeUnit === 'day') {
      const days = Math.ceil(timeRange / oneDay);
      const startIndex = this.startDate.getDay();
      let j = startIndex;
      for (let i = startIndex; i < startIndex + days; i++) {
        labels.push(DateUtil.WEEK_DAYS[j]);
        j++;
        if (j === DateUtil.WEEK_DAYS.length) {
          j = 0;
        }
      }
    } else if (timeUnit === 'week') {
      const weeks = Math.ceil(timeRange / oneWeek);
      for (let i = 0; i < weeks; i++) {
        labels.push(`Week ${i + 1}`);
      }
    } else if (timeUnit === 'month') {
      const startMonth = this.startDate.getMonth();
      const endMonth = this.endDate.getMonth();
      for (let i = startMonth; i <= endMonth; i++) {
        labels.push(DateUtil.MONTHS[i]);
      }
    } else if(timeUnit === 'year') {
      const startYear = this.startDate.getFullYear();
      const endYear = this.endDate.getFullYear();
      for (let i = startYear; i <= endYear; i++) {
        labels.push(i.toString());
      }
    }
    return labels;
  }
}

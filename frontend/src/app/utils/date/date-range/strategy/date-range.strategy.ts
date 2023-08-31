export interface DateRangeStrategy {
  getStartDate: () => Date;
  getEndDate: () => Date;
}

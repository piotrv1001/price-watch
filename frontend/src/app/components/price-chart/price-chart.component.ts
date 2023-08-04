import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PriceService } from 'src/app/services/price.service';
import { ThemeService } from 'src/app/services/theme.service';
import { HistogramData, HistogramOptions } from 'src/app/types/histogram/histogram';
import { DateRangeDropdownOption } from 'src/app/types/price-chart/price-chart';
import { DateRange, DateRangeType } from 'src/app/utils/date/date-range/date-range';
import { CustomDateRangeStrategy } from 'src/app/utils/date/date-range/strategy/custom.strategy';
import { DateUtil } from 'src/app/utils/date/date.util';

@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.scss'],
})
export class PriceChartComponent implements OnInit, OnDestroy {
  @Input() productIdArray: string[] = ['10034334650', '10147698713'];
  grouppedProducts: Map<string, number[]> = new Map<string, number[]>();
  colors: string[] = ['--blue-500', '--pink-500', '--green-500', '--yellow-500', '--purple-500', '--red-500'];
  data?: HistogramData;
  options?: HistogramOptions;
  subs: Subscription[] = [];
  dateRange: DateRange | null = null;
  startDate?: Date;
  endDate?: Date;
  dateRangeDropdownOptions: DateRangeDropdownOption[] = [];
  selectedDropdownOption: DateRangeType | null = null;

  constructor(
    private priceService: PriceService,
    private themeService: ThemeService
  ) {
    this.dateRange = new DateRange();
    this.dateRange.setDateRangeStrategy('last-week');
    this.updateDates();
  }

  ngOnInit() {
    this.initDropdownOptions();
    this.getChartOptions();
    this.getGrouppedProducts();
    this.getThemeChange();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getThemeChange(): void {
    this.subs.push(
      this.themeService.getTheme().subscribe(() => {
        this.getChartOptions();
      })
    );
  }

  handleDropdownChange(): void {
    if(this.selectedDropdownOption === null) {
      return;
    }
    this.dateRange?.setDateRangeStrategy(this.selectedDropdownOption);
    this.updateDates();
    this.getGrouppedProducts();
  }

  handleStartDateChange(startDate: Date): void {
    this.startDate = startDate;
    this.dateRange?.setDateRangeStrategy('custom');
    if(this.dateRange?.dateRangeStrategy instanceof CustomDateRangeStrategy && startDate) {
      this.dateRange.dateRangeStrategy.setStartDate(startDate);
      this.getGrouppedProducts();
    }
  }

  handleEndDateChange(endDate: Date): void {
    this.endDate = endDate;
    this.dateRange?.setDateRangeStrategy('custom');
    if(this.dateRange?.dateRangeStrategy instanceof CustomDateRangeStrategy && endDate) {
      this.dateRange.dateRangeStrategy.setEndDate(endDate);
      this.getGrouppedProducts();
    }
  }

  private getChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }

  private getGrouppedProducts(): void {
    this.subs.push(
      this.priceService.getPricesByProductIds(this.productIdArray).subscribe((response: Record<string, number[]>) => {
        this.grouppedProducts = new Map<string, number[]>(Object.entries(response));
        this.getChartData();
      })
    );
  }

  private initDropdownOptions(): void {
    this.dateRangeDropdownOptions = [
      { label: 'Last week', value: 'last-week' },
      { label: 'Last month', value: 'last-month' },
      { label: 'Last year',  value: 'last-year' }
    ];
  }

  private getFakeData(length: number): number[] {
    const data: number[] = [];
    for (let i = 0; i < length; i++) {
      data.push(Math.floor(Math.random() * 100));
    }
    return data;
  }

  private getChartData(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = this.dateRange?.getChartLabels() ?? DateUtil.WEEK_DAYS;
    this.data = {
      labels,
      datasets: Array.from(this.grouppedProducts).map((entry: [string, number[]], index: number) => ({
        label: entry[0],
        // data: entry[1],
        data: this.getFakeData(labels.length),
        fill: false,
        borderColor: documentStyle.getPropertyValue(this.colors[index]),
        tension: 0.4
      }))
    };
  }

  private updateDates(): void {
    this.startDate = this.dateRange?.getStartDate();
    this.endDate = this.dateRange?.getEndDate();
  }
}

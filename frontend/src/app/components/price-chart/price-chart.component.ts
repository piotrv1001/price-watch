import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { Subscription } from 'rxjs';
import { PRICE_CHART_COLORS } from 'src/app/app.constants';
import { PriceService } from 'src/app/services/price.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ToastService } from 'src/app/services/toast.service';
import { HistogramData, HistogramOptions } from 'src/app/types/histogram/histogram';
import { DateRange, DateRangeType } from 'src/app/utils/date/date-range/date-range';
import { CustomDateRangeStrategy } from 'src/app/utils/date/date-range/strategy/custom.strategy';
import { DateUtil } from 'src/app/utils/date/date.util';

@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.scss'],
})
export class PriceChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() productIdArray: string[] = [];
  grouppedProducts: Map<string, number[]> = new Map<string, number[]>();
  data?: HistogramData;
  options?: HistogramOptions;
  subs: Subscription[] = [];
  dateRange: DateRange | null = null;
  startDate?: Date;
  endDate?: Date;
  selectedDropdownOption: DateRangeType | null = null;

  constructor(
    private priceService: PriceService,
    private themeService: ThemeService,
    private toastService: ToastService
  ) {
    this.dateRange = new DateRange();
    this.dateRange.setDateRangeStrategy('last-week');
    this.updateDates();
  }

  ngOnInit() {
    this.getChartOptions();
    this.getGrouppedProducts();
    this.getThemeChange();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['productIdArray'] && changes['productIdArray'].currentValue) {
      this.getGrouppedProducts();
    }
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

  handleDropdownChange(dropdownOption: DateRangeType): void {
    this.selectedDropdownOption = dropdownOption;
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
      this.priceService.getPricesByProductIds(this.productIdArray, this.startDate?.toISOString(), this.endDate?.toISOString()).subscribe({
        next: (response: Record<string, number[]>) => {
          this.grouppedProducts = new Map<string, number[]>(Object.entries(response));
          this.getChartData();
        },
        error: (error) => {
          this.toastService.handleError(error);
        }
      })
    );
  }

  private getChartData(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = this.dateRange?.getChartLabels() ?? DateUtil.WEEK_DAYS;
    this.data = {
      labels,
      datasets: Array.from(this.grouppedProducts).map((entry: [string, number[]], index: number) => ({
        label: `Product ${index + 1}`,
        data: entry[1],
        fill: false,
        borderColor: documentStyle.getPropertyValue(PRICE_CHART_COLORS[index]),
        tension: 0.4
      }))
    };
  }

  private updateDates(): void {
    this.startDate = this.dateRange?.getStartDate();
    this.endDate = this.dateRange?.getEndDate();
  }
}

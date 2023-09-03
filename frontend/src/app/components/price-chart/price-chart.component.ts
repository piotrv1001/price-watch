import {
  Component,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { Subscription } from 'rxjs';
import {
  PRICE_CHART_COLORS,
  PRICE_CHART_COLORS_TRANSPARENT,
} from 'src/app/app.constants';
import { CreatePriceDTO } from 'src/app/models/dto/create-price.dto';
import { PriceChartService } from 'src/app/services/price-chart.service';
import { PriceService } from 'src/app/services/price.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ToastService } from 'src/app/services/toast.service';
import {
  HistogramData,
  HistogramOptions,
} from 'src/app/types/histogram/histogram';
import {
  DateRange,
  DateRangeType,
} from 'src/app/utils/date/date-range/date-range';
import { CustomDateRangeStrategy } from 'src/app/utils/date/date-range/strategy/custom.strategy';
import { DateUtil } from 'src/app/utils/date/date.util';

@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.scss'],
})
export class PriceChartComponent implements OnInit, OnChanges, OnDestroy {
  @Input() productIdArray: string[] = [];
  grouppedProducts: Map<string, CreatePriceDTO[]> = new Map<string,CreatePriceDTO[]>();
  data?: HistogramData;
  options?: HistogramOptions;
  subs: Subscription[] = [];
  dateRange: DateRange | null = null;
  startDate?: Date;
  endDate?: Date;
  selectedDropdownOption: DateRangeType | null = null;
  labels: string[] = [];

  constructor(
    private priceService: PriceService,
    private themeService: ThemeService,
    private toastService: ToastService,
    private priceChartService: PriceChartService
  ) {
    this.dateRange = new DateRange();
    this.dateRange.setDateRangeStrategy('last-week');
    this.updateDates();
  }

  ngOnInit() {
    this.getChartOptions();
    this.getGrouppedProducts();
    this.getThemeChange();
    this.subs.push(
      this.priceChartService.getProductRemovedIndex().subscribe((index: number) => {
        const removedProductId = this.productIdArray[index];
        this.productIdArray.splice(index, 1);
        this.grouppedProducts.delete(removedProductId);
        this.getChartData();
      })
    );
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
    if (
      this.dateRange?.dateRangeStrategy instanceof CustomDateRangeStrategy &&
      startDate
    ) {
      this.dateRange.dateRangeStrategy.setStartDate(startDate);
      this.getGrouppedProducts();
    }
  }

  handleEndDateChange(endDate: Date): void {
    this.endDate = endDate;
    this.dateRange?.setDateRangeStrategy('custom');
    if (
      this.dateRange?.dateRangeStrategy instanceof CustomDateRangeStrategy &&
      endDate
    ) {
      this.dateRange.dateRangeStrategy.setEndDate(endDate);
      this.getGrouppedProducts();
    }
  }

  private getChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          ticks: {
            callback: (value: any, index: number) => {
              const maxLabels = 7;
              const div = Math.floor(this.labels.length / (maxLabels + 1));
              if(index % (div + 1) === 0) {
                return this.labels[index];
              }
              return '';
            },
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          }
        },
        y: {
          ticks: {
            color: textColorSecondary
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false
          }
        }
      }
    };
  }

  private getGrouppedProducts(): void {
    if (this.productIdArray.length === 0) {
      this.grouppedProducts = new Map<string, CreatePriceDTO[]>();
      this.getChartData();
      return;
    }
    this.subs.push(
      this.priceService
        .getPricesByProductIds(
          this.productIdArray,
          this.startDate?.toISOString(),
          this.endDate?.toISOString()
        )
        .subscribe({
          next: (response: Record<string, CreatePriceDTO[]>) => {
            this.grouppedProducts = new Map<string, CreatePriceDTO[]>(
              Object.entries(response)
            );
            this.getChartData();
          },
          error: (error) => {
            this.toastService.handleError(error);
          },
        })
    );
  }

  private getChartData(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const labels = DateUtil.getLabels(this.startDate, this.endDate);
    this.labels = labels;
    this.data = {
      labels,
      datasets: Array.from(this.grouppedProducts).map(
        (entry: [string, CreatePriceDTO[]], index: number) => ({
          label: `Product ${index + 1}`,
          data: entry[1].map((price: CreatePriceDTO) => price.price!),
          fill: false,
          borderColor: documentStyle.getPropertyValue(
            PRICE_CHART_COLORS[index]
          ),
          backgroundColor: documentStyle.getPropertyValue(
            PRICE_CHART_COLORS_TRANSPARENT[index]
          ),
          pointStyle: 'circle',
          pointRadius: 10,
          pointHoverRadius: 15,
          tension: 0.4,
        })
      ),
    };
  }

  private updateDates(): void {
    this.startDate = this.dateRange?.getStartDate();
    this.endDate = this.dateRange?.getEndDate();
  }
}

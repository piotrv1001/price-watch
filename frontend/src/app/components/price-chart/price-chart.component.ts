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
import { StringUtil } from 'src/app/utils/string/string.util';

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
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      interaction: {
        mode: 'index',
        intersect: false,
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          enabled: false,
          position: 'nearest',
          external: this.externalTooltipHandler,
          callbacks: {
            label: (context: any) => {
              const label = context?.dataset?.label ?? '';
              const formattedValue = context?.formattedValue ?? '';
              if(formattedValue) {
                const formattedPrice = StringUtil.formatPrice(formattedValue);
                if(label) {
                  return `${label} - ${formattedPrice} zł`;
                }
                return `${formattedPrice} zł`;
              }
              return '';
            }
          }
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
              return null;
            },
            maxRotation: 0,
            minRotation: 0,
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
          pointStyle: (context: any) => {
            return this.getPointStyle(context.dataIndex, entry[1].length);
          },
          pointRadius: this.getPointRadius(entry[1].length),
          pointHoverRadius: this.getPointHoverRadius(entry[1].length),
          tension: 0.2,
        })
      ),
    };
  }

  private getPointStyle(index: number, len: number): string | boolean {
    const div = Math.floor(len / 30);
    if (div === 0) {
      return 'circle';
    } else {
      return index % (div + 1) === 0 ? 'circle' : false;
    }
  }

  private getPointRadius(len: number): number {
    if (len >= 0 && len <= 7) {
      return 8;
    } else if (len > 7 && len <= 14) {
      return 6;
    }
    return 4;
  }

  private getPointHoverRadius(len: number): number {
    if (len >= 0 && len <= 7) {
      return 10;
    } else if (len > 7 && len <= 14) {
      return 8;
    }
    return 6;
  }

  getOrCreateTooltip = (chart: any) => {
    let tooltipEl = chart.canvas.parentNode.querySelector('div');
    if (!tooltipEl) {
      tooltipEl = document.createElement('div');
      tooltipEl.style.background = 'rgba(0, 0, 0, 0.7)';
      tooltipEl.style.borderRadius = '3px';
      tooltipEl.style.color = 'white';
      tooltipEl.style.opacity = 1;
      tooltipEl.style.pointerEvents = 'none';
      tooltipEl.style.position = 'absolute';
      tooltipEl.style.transform = 'translate(-50%, 0)';
      tooltipEl.style.transition = 'all .2s ease';
      const table = document.createElement('table');
      table.style.margin = '0px';
      tooltipEl.appendChild(table);
      chart.canvas.parentNode.appendChild(tooltipEl);
    }
    return tooltipEl;
  }

  externalTooltipHandler = (context: any) => {
    const {chart, tooltip} = context;
    const tooltipEl = this.getOrCreateTooltip(chart);
    if (tooltip.opacity === 0) {
      tooltipEl.style.opacity = 0;
      return;
    }
    const index = context?.tooltip?.dataPoints[0]?.dataIndex ?? -1;
    const len = this.grouppedProducts.get(this.productIdArray[0])?.length ?? -1;
    if(index !== -1 && len !== -1) {
      const div = Math.floor(len / 30);
      if (div !== 0 && index % (div + 1) !== 0) {
        return;
      }
    }
    if (tooltip.body) {
      const titleLines = tooltip.title ?? [];
      const bodyLines = tooltip.body.map((b: any) => b.lines);
      const tableHead = document.createElement('thead');
      titleLines.forEach((title: any) => {
        const tr = document.createElement('tr');
        tr.style.borderWidth = '0';
        const th = document.createElement('th');
        th.style.borderWidth = '0';
        const text = document.createTextNode(title);
        th.appendChild(text);
        tr.appendChild(th);
        tableHead.appendChild(tr);
      });
      const tableBody = document.createElement('tbody');
      bodyLines.forEach((body: any, i: number) => {
        const colors = tooltip.labelColors[i];
        const span = document.createElement('span');
        span.style.background = colors.backgroundColor;
        span.style.borderColor = colors.borderColor;
        span.style.borderWidth = '2px';
        span.style.marginRight = '10px';
        span.style.height = '10px';
        span.style.width = '10px';
        span.style.display = 'inline-block';
        const tr = document.createElement('tr');
        tr.style.backgroundColor = 'inherit';
        tr.style.borderWidth = '0';
        const td = document.createElement('td');
        td.style.borderWidth = '0';
        const text = document.createTextNode(body);
        td.appendChild(span);
        td.appendChild(text);
        tr.appendChild(td);
        tableBody.appendChild(tr);
      });
      const tableRoot = tooltipEl.querySelector('table');
      while (tableRoot.firstChild) {
        tableRoot.firstChild.remove();
      }
      tableRoot.appendChild(tableHead);
      tableRoot.appendChild(tableBody);
    }
    const { offsetLeft: positionX, offsetTop: positionY, width } = chart.canvas;
    const tooltipWidth = tooltip.width;
    const firstQuadrantThreshold = width / 4;
    const thirdQuadrantThreshold = (width / 4) * 3;
    if(tooltip.caretX > thirdQuadrantThreshold) {
      tooltipEl.style.left = positionX + tooltip.caretX - (tooltipWidth / 2) + 'px';
    } else if(tooltip.caretX < firstQuadrantThreshold) {
      tooltipEl.style.left = positionX + tooltip.caretX + (tooltipWidth / 2) + 'px';
    } else {
      tooltipEl.style.left = positionX + tooltip.caretX + 'px';
    }
    tooltipEl.style.opacity = 1;
    tooltipEl.style.top = positionY + tooltip.caretY + 'px';
    tooltipEl.style.font = tooltip.options.bodyFont.string;
    tooltipEl.style.padding = tooltip.options.padding + 'px ' + tooltip.options.padding + 'px';
  };

  private updateDates(): void {
    this.startDate = this.dateRange?.getStartDate();
    this.endDate = this.dateRange?.getEndDate();
  }
}

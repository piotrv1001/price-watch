import { TranslateService } from '@ngx-translate/core';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { Seller } from "src/app/models/seller/seller";
import { ProductService } from "src/app/services/product.service";
import { ThemeService } from "src/app/services/theme.service";
import { ToastService } from "src/app/services/toast.service";
import { HistogramData, HistogramOptions } from "src/app/types/histogram/histogram";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { Router } from '@angular/router';

export type FormatType = 'value' | 'percentage';
export interface FormatOption {
  value: FormatType;
  label: string;
  translate: boolean;
}
type ChartType = 'bar' | 'doughnut';
interface ChartOption {
  value: ChartType;
  icon: string;
}

@Component({
  selector: 'app-price-buckets-page',
  templateUrl: './price-buckets-page.component.html',
  styleUrls: ['./price-buckets-page.component.scss']
})
export class PriceBucketsPageComponent implements OnInit, OnDestroy {
  chartOptions: ChartOption[] = [];
  selectedChart: ChartType = 'bar';
  formatOptions: FormatOption[] = [];
  selectedFormatOption: FormatType = 'value';
  currentSeller: Seller | null = null;
  loading = false;
  barData?: HistogramData;
  doughnutData?: HistogramData;
  doughnutOptions?: HistogramOptions;
  barOptions?: HistogramOptions;
  grouppedProducts: number[] = [0, 0, 0, 0];
  subs: Subscription[] = [];
  plugins: any[] = [ChartDataLabels];

  constructor(
    private productService: ProductService,
    private themeService: ThemeService,
    private toastService: ToastService,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.getChartTypeOptions();
    this.getFormatOptions();
    this.currentSeller = { id: 1, name: 'SmartLED' };
    this.getPrices();
    this.getThemeChange();
    this.getLangChange();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
    this.getPrices();
  }

  handleFormatChange(): void {
    this.getChartOptions();
  }

  getThemeChange(): void {
    this.subs.push(
      this.themeService.getTheme().subscribe(() => {
        setTimeout(() => {
          this.getChartOptions();
        });
      })
    );
  }

  getLangChange(): void {
    this.subs.push(
      this.translateService.onLangChange.subscribe(() => {
        this.getChartData();
      })
    );
  }

  private getChartTypeOptions(): void {
    this.chartOptions = [
      {
        value: 'bar',
        icon: 'pi pi-chart-bar'
      },
      {
        value: 'doughnut',
        icon: 'pi pi-chart-pie'
      }
    ];
  }

  private getFormatOptions(): void {
    this.formatOptions = [
      {
        value: 'value',
        label: 'chart.format.value',
        translate: true
      },
      {
        value: 'percentage',
        label: '%',
        translate: false
      }
    ];
  }

  private getPrices(): void {
    if(!this.currentSeller?.name) {
      return;
    }
    this.loading = true;
    this.subs.push(
      this.productService.getPriceBuckets(this.currentSeller.name).subscribe({
        next: (products) => {
          this.loading = false;
          this.grouppedProducts = products;
          this.getChartData();
          this.getChartOptions();
        },
        error: (error) => {
          this.loading = false;
          this.toastService.handleError(error);
        }
      })
    );
  }

  private getChartData(): void {
    const bgColors = [
      'rgba(255, 159, 64, 1)',
      'rgba(75, 192, 192, 1)',
      'rgba(54, 162, 235, 1)',
      'rgba(153, 102, 255, 1)'
    ];
    const borderColors = bgColors;

    this.barData = {
      labels: [
        this.translateService.instant('chart.buckets.cheap'),
        this.translateService.instant('chart.buckets.medium'),
        this.translateService.instant('chart.buckets.expensive'),
        this.translateService.instant('chart.buckets.veryExpensive')
      ],
      datasets: [
        {
          label: this.translateService.instant('global.products'),
          data: this.grouppedProducts,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 10
        },
      ]
    };

    this.doughnutData = {
      labels: [
        this.translateService.instant('chart.buckets.cheap'),
        this.translateService.instant('chart.buckets.medium'),
        this.translateService.instant('chart.buckets.expensive'),
        this.translateService.instant('chart.buckets.veryExpensive')
      ],
      datasets: [
        {
          label: this.translateService.instant('global.products'),
          data: this.grouppedProducts,
          backgroundColor: bgColors,
          borderColor: borderColors
        },
      ]
    }
  }

  private getFormatter(): any {
    if(this.selectedFormatOption === 'percentage') {
      return (value: number, context: any) => {
        const data = context?.dataset?.data;
        if(data) {
          const sum = data.reduce((a: number, b: number) => a + b, 0);
          if(sum === 0) {
            return '';
          }
          const percentage = (value / sum) * 100;
          return Math.round(percentage) + '%';
        }
        return value;
      }
    }
    return (value: number) => value;
  }

  private getChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.barOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        datalabels: {
          display: true,
          color: surfaceBorder,
          font: {
            weight: 'bold',
            size: 18
          },
          formatter: this.getFormatter(),
          align: 'center',
          anchor: 'center'
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        x: {
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

    this.doughnutOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true,
          position: 'bottom',
          labels: {
            color: textColor,
          },
        },
        datalabels: {
          display: true,
          color: surfaceBorder,
          font: {
            weight: 'bold',
            size: 18
          },
          formatter: this.getFormatter(),
          align: 'center',
          anchor: 'center'
        }
      }
    };
  }
}

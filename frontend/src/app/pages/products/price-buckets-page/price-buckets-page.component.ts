import { TranslateService } from '@ngx-translate/core';
import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { Seller } from "src/app/models/seller/seller";
import { ProductService } from "src/app/services/product.service";
import { ThemeService } from "src/app/services/theme.service";
import { ToastService } from "src/app/services/toast.service";
import { HistogramData, HistogramOptions } from "src/app/types/histogram/histogram";
import ChartDataLabels from 'chartjs-plugin-datalabels';

@Component({
  selector: 'app-price-buckets-page',
  templateUrl: './price-buckets-page.component.html',
  styleUrls: ['./price-buckets-page.component.scss']
})
export class PriceBucketsPageComponent {
  currentSeller: Seller | null = null;
  loading = false;
  basicData?: HistogramData;
  basicOptions?: HistogramOptions;
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

  getThemeChange(): void {
    this.subs.push(
      this.themeService.getTheme().subscribe(() => {
        this.getChartOptions();
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

    this.basicData = {
      labels: [
        this.translateService.instant('chart.buckets.cheap'),
        this.translateService.instant('chart.buckets.medium'),
        this.translateService.instant('chart.buckets.expensive'),
        this.translateService.instant('chart.buckets.veryExpensive')
      ],
      datasets: [
        {
          label: 'Products',
          data: this.grouppedProducts,
          backgroundColor: bgColors,
          borderColor: borderColors,
          borderWidth: 1,
          borderRadius: 10
        },
      ]
    };
  }

  private getChartOptions(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.basicOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false,
          labels: {
            color: textColor,
          },
        },
        datalabels: {
          display: true,
          color: textColor,
          font: {
            weight: 'bold'
          },
          formatter: Math.round,
          align: 'end',
          anchor: 'end'
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
  }
}

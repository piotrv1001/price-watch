import { Component } from "@angular/core";
import { Subscription } from "rxjs";
import { ProductWithPrice } from "src/app/models/product/product-with-price";
import { Seller } from "src/app/models/seller/seller";
import { ProductService } from "src/app/services/product.service";
import { ThemeService } from "src/app/services/theme.service";
import { ToastService } from "src/app/services/toast.service";
import { Bucket } from "src/app/types/histogram/bucket";
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
    private toastService: ToastService
  ) {}

  ngOnInit() {
    this.currentSeller = { id: 1, name: 'SmartLED' };
    this.getPrices();
    this.getThemeChange();
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

  private getPrices(): void {
    if(!this.currentSeller?.name) {
      return;
    }
    this.loading = true;
    this.subs.push(
      this.productService.getBySeller(this.currentSeller.name).subscribe({
        next: (products) => {
          this.loading = false;
          this.grouppedProducts = this.groupProducts(products);
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

  private groupProducts(products: ProductWithPrice[]): number[] {
    const grouppedProducts: number[] = [0, 0, 0, 0];
    products.forEach((product: ProductWithPrice) => {
      const price = product.currentPrice;
      if (price) {
        if (price < 20) {
          grouppedProducts[Bucket.CHEAP] += 1;
        } else if (price < 50) {
          grouppedProducts[Bucket.MEDIUM] += 1;
        } else if (price < 100) {
          grouppedProducts[Bucket.EXPENSIVE] += 1;
        } else {
          grouppedProducts[Bucket.VERY_EXPENSIVE] += 1;
        }
      }
    });
    return grouppedProducts;
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
        'Cheap (0 - 20 zł)',
        'Medium (20 - 50 zł)',
        'Expensive (50 - 100 zł)',
        'Very expensive (100+ zł)',
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

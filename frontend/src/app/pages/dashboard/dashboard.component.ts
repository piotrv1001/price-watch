import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription, catchError, forkJoin, of } from "rxjs";
import { PriceChangeDTO } from "src/app/models/dto/price-change.dto";
import { Product } from "src/app/models/product/product";
import { Seller } from "src/app/models/seller/seller";
import { PriceService } from "src/app/services/price.service";
import { ProductService } from "src/app/services/product.service";
import { ToastService } from "src/app/services/toast.service";
import { HistogramData, HistogramOptions } from "src/app/types/histogram/histogram";
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ThemeService } from "src/app/services/theme.service";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit, OnDestroy {
  newProducts: Product[] = [];
  priceChanges: PriceChangeDTO[] = [];
  currentSeller: Seller | null = null;
  loading = false;
  startDate?: Date;
  endDate?: Date;
  barData?: HistogramData;
  barOptions?: HistogramOptions;
  doughnutData?: HistogramData;
  doughnutOptions?: HistogramOptions;
  plugins: any[] = [ChartDataLabels];
  grouppedProducts: number[] = [0, 0, 0, 0];
  subs: Subscription[] = [];
  logo?: string;
  darkTheme = false;

  constructor(
    private priceService: PriceService,
    private productService: ProductService,
    private toastService: ToastService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
    this.init();
    this.getChartOptions();
    this.getThemeChange();
    this.getData();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getThemeChange(): void {
    this.subs.push(
      this.themeService.getTheme().subscribe((darkTheme) => {
        this.darkTheme = darkTheme;
        this.getChartOptions();
        this.logo = this.darkTheme ? this.currentSeller?.logoDarkTheme : this.currentSeller?.logoLightTheme;
      })
    );
  }

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
    this.logo = this.darkTheme ? this.currentSeller?.logoDarkTheme : this.currentSeller?.logoLightTheme;
    this.getData();
  }

  private init(): void {
    this.currentSeller = {
      id: 1,
      name: 'SmartLED',
      logoLightTheme: 'smart_led_logo_light_theme.png',
      logoDarkTheme: 'smart_led_logo_dark_theme.png',
    },
    this.logo = this.currentSeller?.logoLightTheme;
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 14);
    this.endDate = new Date();
  }

  private getData(): void {
    if(!this.currentSeller?.name) {
      return;
    }
    this.loading = true;
    const newProducts$ = this.priceService.getNewProducts(
      this.currentSeller.name,
      this.startDate?.toISOString(),
      this.endDate?.toISOString()
    );
    const priceChanges$ = this.priceService.getPriceChanges(
      this.currentSeller.name,
      this.startDate?.toISOString(),
      this.endDate?.toISOString()
    );
    const priceBuckets$ = this.productService.getPriceBuckets(this.currentSeller.name);
    const sources$ = forkJoin([
      newProducts$.pipe(catchError(() => of(null))),
      priceChanges$.pipe(catchError(() => of(null))),
      priceBuckets$.pipe(catchError(() => of(null)))]
    );
    this.subs.push(
      sources$.subscribe(([newProducts, priceChanges, priceBuckets]) => {
        this.loading = false;
        if (newProducts !== null) {
          this.newProducts = newProducts;
        }
        if (priceChanges !== null) {
          this.priceChanges = priceChanges;
        }
        if (priceBuckets !== null) {
          this.grouppedProducts = priceBuckets;
          this.getChartData();
          this.getChartOptions();
        }
        if(newProducts === null || priceChanges === null || priceBuckets === null) {
          this.toastService.errorMessage('Error fetching data');
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

    this.doughnutData = {
      labels: [
        'Cheap',
        'Medium',
        'Expensive',
        'Very expensive',
      ],
      datasets: [
        {
          label: 'Products',
          data: this.grouppedProducts,
          backgroundColor: bgColors,
          borderColor: borderColors
        },
      ]
    }
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
          display: false,
          labels: {
            color: textColor,
          }
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
          }
        },
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          }
        }
      }
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
          color: textColor,
          font: {
            weight: 'bold'
          },
          formatter: Math.round,
          align: 'end',
          anchor: 'end'
        }
      }
    };
  }
}

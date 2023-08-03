import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductWithPrice } from 'src/app/models/product/product-with-price';
import { ProductService } from 'src/app/services/product.service';
import { Bucket } from 'src/app/types/histogram/bucket';
import { HistogramData, HistogramOptions } from 'src/app/types/histogram/histogram';

@Component({
  selector: 'app-histogram',
  templateUrl: './histogram.component.html',
  styleUrls: ['./histogram.component.scss'],
})
export class HistogramComponent implements OnInit, OnDestroy {
  basicData?: HistogramData;
  basicOptions?: HistogramOptions;
  grouppedProducts: number[] = [0, 0, 0, 0];
  subs: Subscription[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit() {
    this.getPrices();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private getPrices(): void {
    const seller = 'SmartLED';
    this.subs.push(
      this.productService.getBySeller(seller).subscribe((products) => {
        this.grouppedProducts = this.groupProducts(products);
        this.initChart();
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

  private initChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue('--text-color-secondary');
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');
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
      ],
    };

    this.basicOptions = {
      responsive: false,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
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

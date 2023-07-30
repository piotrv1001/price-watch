import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { PriceService } from 'src/app/services/price.service';
import { DateUtil } from 'src/app/utils/date.util';

@Component({
  selector: 'app-price-chart',
  templateUrl: './price-chart.component.html',
  styleUrls: ['./price-chart.component.scss'],
})
export class PriceChartComponent implements OnInit, OnDestroy {
  @Input() productIdArray: string[] = ['10034334650', '10147698713'];
  grouppedProducts: Map<string, number[]> = new Map<string, number[]>();
  colors: string[] = ['--blue-500', '--pink-500', '--green-500', '--yellow-500', '--purple-500', '--red-500'];
  data: any;
  options: any;
  subs: Subscription[] = [];

  constructor(private priceService: PriceService) {}

  ngOnInit() {
    this.getGrouppedProducts();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private getGrouppedProducts(): void {
    this.subs.push(
      this.priceService.getPricesByProductIds(this.productIdArray).subscribe((response: Record<string, number[]>) => {
        this.grouppedProducts = new Map<string, number[]>(Object.entries(response));
        this.initChart();
      })
    );
  }

  private initChart(): void {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: DateUtil.MONTHS,
      datasets: Array.from(this.grouppedProducts).map((entry: [string, number[]], index: number) => ({
        label: entry[0],
        data: entry[1],
        fill: false,
        borderColor: documentStyle.getPropertyValue(this.colors[index]),
        tension: 0.4
      }))
    };

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
}

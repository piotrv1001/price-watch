import { animate, style, transition, trigger } from "@angular/animations";
import { Component, Input } from "@angular/core";
import { PriceChartService } from "src/app/services/price-chart.service";
import { PriceLegend } from "src/app/types/price-legend/price-legend";

@Component({
  selector: 'app-price-legend',
  templateUrl: './price-legend.component.html',
  styleUrls: ['./price-legend.component.scss'],
  animations: [
    trigger('legendItemAnim', [
      transition(':leave', [
        animate(200, style({
          opacity: 0,
          height: 0
        }))
      ])
    ])
  ]
})
export class PriceLegendComponent {
  @Input() priceLegendArray: PriceLegend[] = [];

  constructor(private priceChartService: PriceChartService) {}

  removeItem(index: number): void {
    this.priceChartService.setProductRemovedIndex(index);
  }
}

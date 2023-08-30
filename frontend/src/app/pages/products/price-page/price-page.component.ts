import { Component } from "@angular/core";
import { PRICE_CHART_COLORS } from "src/app/app.constants";
import { Product } from "src/app/models/product/product";
import { PriceLegend } from "src/app/types/price-legend/price-legend";

@Component({
  selector: 'app-price-page',
  templateUrl: './price-page.component.html',
  styleUrls: ['./price-page.component.scss']
})
export class PricePageComponent {
  productIdArray: string[] = [];
  priceLegendArray: PriceLegend[] = [];

  updateProductIdArray(event: Product[]): void {
    this.productIdArray = event.map((product: Product) => product.id!);
    this.priceLegendArray = event.map((product: Product, index: number) => {
      return {
        index: index + 1,
        productName: product.name!,
        color: `var(${PRICE_CHART_COLORS[index]})`
      };
    });
  }
}

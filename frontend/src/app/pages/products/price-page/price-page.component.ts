import { Component, OnDestroy, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { PRICE_CHART_COLORS } from "src/app/app.constants";
import { Product } from "src/app/models/product/product";
import { PriceChartService } from "src/app/services/price-chart.service";
import { PriceLegend } from "src/app/types/price-legend/price-legend";

@Component({
  selector: 'app-price-page',
  templateUrl: './price-page.component.html',
  styleUrls: ['./price-page.component.scss']
})
export class PricePageComponent implements OnInit, OnDestroy {
  productIdArray: string[] = [];
  priceLegendArray: PriceLegend[] = [];
  subs: Subscription[] = [];
  productFromNav?: any;
  loading = false;

  constructor(
    private priceChartService: PriceChartService,
    private router: Router
  ) {
    const product = this.router.getCurrentNavigation()?.extras.state?.["product"];
    if(product) {
      const productId = product.productId;
      this.productIdArray.push(productId);
      this.productFromNav = product;
      this.priceLegendArray.push({
        index: 1,
        product: product,
        color: `var(${PRICE_CHART_COLORS[0]})`
      });
    }
  }

  ngOnInit(): void {
    this.loading = true;
    this.subs.push(
      this.priceChartService.getProductRemovedIndex().subscribe((index: number) => {
        this.priceLegendArray.splice(index, 1);
        this.priceLegendArray = this.priceLegendArray.map((legend: PriceLegend, idx: number) => {
          return {...legend, index: idx + 1, color: `var(${PRICE_CHART_COLORS[idx]})`};
        });
      })
    );
    this.subs.push(
      this.priceChartService.getProductsInitialized().subscribe(() => {
        this.loading = false;
        if(this.productFromNav) {
          this.priceChartService.setNewProduct(this.productFromNav);
        }
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  updateProductIdArray(event: Product[]): void {
    this.productIdArray = event.map((product: Product) => product.id!);
    this.priceLegendArray = event.map((product: Product, index: number) => {
      return {
        index: index + 1,
        product: product,
        color: `var(${PRICE_CHART_COLORS[index]})`
      };
    });
  }
}

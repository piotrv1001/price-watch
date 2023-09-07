import { NgModule } from "@angular/core";

import { PricePageComponent } from "./price-page.component";

import { SharedModule } from "src/app/shared/shared.module";
import { PriceChartModule } from "src/app/components/price-chart/price-chart.module";
import { ProductMultiSelectModule } from "src/app/components/product-multi-select/product-multi-select.module";
import { PriceLegendModule } from "src/app/components/price-legend/price-legend.module";
import { SpinnerModule } from "src/app/components/spinner/spinner.module";

@NgModule({
  imports: [
    SharedModule,
    PriceChartModule,
    ProductMultiSelectModule,
    PriceLegendModule,
    SpinnerModule
  ],
  declarations: [
    PricePageComponent
  ],
  exports: [
    PricePageComponent
  ]
})
export class PricePageModule {

}

import { NgModule } from "@angular/core";

import { PricePageComponent } from "./price-page.component";

import { PriceChartModule } from "src/app/components/price-chart/price-chart.module";
import { ProductMultiSelectModule } from "src/app/components/product-multiselect/product-multi-select.module";

@NgModule({
  imports: [
    PriceChartModule,
    ProductMultiSelectModule
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

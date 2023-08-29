import { NgModule } from "@angular/core";

import { PricePageComponent } from "./price-page.component";

import { PriceChartModule } from "src/app/components/price-chart/price-chart.module";

@NgModule({
  imports: [
    PriceChartModule
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

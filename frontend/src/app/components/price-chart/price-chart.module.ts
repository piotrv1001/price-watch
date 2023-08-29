import { NgModule } from "@angular/core";

import { PriceChartComponent } from "./price-chart.component";

import { ChartModule } from "primeng/chart";

import { ChartExportPngButtonModule } from "../chart-export-png-btn/chart-export-png-btn.module";
import { DateRangeWithOptionsModule } from "../date-range-with-options/date-range-with-options.module";

@NgModule({
  imports: [
    ChartModule,
    ChartExportPngButtonModule,
    DateRangeWithOptionsModule
  ],
  declarations: [
    PriceChartComponent
  ],
  exports: [
    PriceChartComponent
  ]
})
export class PriceChartModule {

}

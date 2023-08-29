import { NgModule } from "@angular/core";

import { HistogramComponent } from "./histogram.component";

import { ChartModule } from "primeng/chart";

import { ChartExportPngButtonModule } from "../chart-export-png-btn/chart-export-png-btn.module";

@NgModule({
  imports: [
    ChartModule,
    ChartExportPngButtonModule
  ],
  declarations: [
    HistogramComponent
  ],
  exports: [
    HistogramComponent
  ]
})
export class HistogramModule {

}

import { NgModule } from "@angular/core";

import { ChartExportPngBtnComponent } from "./chart-export-png-btn.component";

import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@NgModule({
  imports: [
    ButtonModule,
    TooltipModule
  ],
  declarations: [
    ChartExportPngBtnComponent
  ],
  exports: [
    ChartExportPngBtnComponent
  ]
})
export class ChartExportPngButtonModule {

}

import { NgModule } from "@angular/core";

import { ExcelExportBtnComponent } from "./excel-export-btn.component";

import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@NgModule({
  imports: [
    ButtonModule,
    TooltipModule
  ],
  declarations: [
    ExcelExportBtnComponent
  ],
  exports: [
    ExcelExportBtnComponent
  ]
})
export class ExcelExportBtnModule {

}

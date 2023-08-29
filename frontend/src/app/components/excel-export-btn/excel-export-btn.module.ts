import { NgModule } from "@angular/core";

import { ExcelExportBtnComponent } from "./excel-export-btn.component";

import { ButtonModule } from "primeng/button";

@NgModule({
  imports: [
    ButtonModule
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

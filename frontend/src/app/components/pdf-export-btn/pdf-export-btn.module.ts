import { NgModule } from "@angular/core";

import { PdfExportBtnComponent } from "./pdf-export-btn.component";

import { ButtonModule } from "primeng/button";

@NgModule({
  imports: [
    ButtonModule
  ],
  declarations: [
    PdfExportBtnComponent
  ],
  exports: [
    PdfExportBtnComponent
  ]
})
export class PdfExportBtnModule {

}

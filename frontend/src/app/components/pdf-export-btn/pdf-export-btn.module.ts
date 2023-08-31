import { NgModule } from "@angular/core";

import { PdfExportBtnComponent } from "./pdf-export-btn.component";

import { ButtonModule } from "primeng/button";
import { TooltipModule } from "primeng/tooltip";

@NgModule({
  imports: [
    ButtonModule,
    TooltipModule
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

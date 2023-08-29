import { NgModule } from "@angular/core";

import { ProductTableComponent } from "./product-table.component";

import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";

import { ExcelExportBtnModule } from './../excel-export-btn/excel-export-btn.module';
import { PdfExportBtnModule } from "../pdf-export-btn/pdf-export-btn.module";
import { SharedModule } from "src/app/shared/shared.module";
import { PipeModule } from "src/app/pipes/pipe.module";

@NgModule({
  imports: [
    SharedModule,
    PipeModule,
    TableModule,
    ExcelExportBtnModule,
    ProgressBarModule,
    ButtonModule,
    PdfExportBtnModule,
    InputTextModule
  ],
  declarations: [
    ProductTableComponent
  ],
  exports: [
    ProductTableComponent
  ]
})
export class ProductTableModule {

}

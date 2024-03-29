import { NgModule } from "@angular/core";

import { ProductTableComponent } from "./product-table.component";

import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";
import { TooltipModule } from "primeng/tooltip";
import { DynamicDialogModule } from 'primeng/dynamicdialog';

import { ExcelExportBtnModule } from './../excel-export-btn/excel-export-btn.module';
import { PdfExportBtnModule } from "../pdf-export-btn/pdf-export-btn.module";
import { SharedModule } from "src/app/shared/shared.module";
import { ProductNameWithSellerModule } from "../product-name-with-seller/product-name-with-seller.module";
import { NoDataPlaceHolderModule } from "../no-data-placeholder/no-data-placeholder.module";
import { PriceChartDialogModule } from "../price-chart-dialog/price-chart-dialog.module";

@NgModule({
  imports: [
    SharedModule,
    TableModule,
    ExcelExportBtnModule,
    ProgressBarModule,
    ButtonModule,
    PdfExportBtnModule,
    InputTextModule,
    TooltipModule,
    ProductNameWithSellerModule,
    NoDataPlaceHolderModule,
    DynamicDialogModule,
    PriceChartDialogModule
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

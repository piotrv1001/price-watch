import { NgModule } from "@angular/core";

import { PriceBucketsPageComponent } from "./price-buckets-page.component";

import { ChartModule } from "primeng/chart";
import { SelectButtonModule } from 'primeng/selectbutton';

import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";
import { SharedModule } from "src/app/shared/shared.module";
import { SpinnerModule } from "src/app/components/spinner/spinner.module";
import { ChartExportPngButtonModule } from "src/app/components/chart-export-png-btn/chart-export-png-btn.module";

@NgModule({
  imports: [
    SharedModule,
    ChooseSellerModule,
    SpinnerModule,
    ChartExportPngButtonModule,
    ChartModule,
    SelectButtonModule
  ],
  declarations: [
    PriceBucketsPageComponent
  ]
})
export class PriceBucketsPageModule {

}

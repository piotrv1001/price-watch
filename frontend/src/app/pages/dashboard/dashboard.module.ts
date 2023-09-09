import { NgModule } from "@angular/core";

import { DashboardsRoutingModule } from "./dashboard-routing.module";

import { DashboardComponent } from "./dashboard.component";

import { ChartModule } from "primeng/chart";
import { SelectButtonModule } from "primeng/selectbutton";

import { SharedModule } from "src/app/shared/shared.module";
import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";
import { PriceChartModule } from "src/app/components/price-chart/price-chart.module";
import { SpinnerModule } from "src/app/components/spinner/spinner.module";
import { ProductTableModule } from "src/app/components/product-table/product-table.module";
import { ChartExportPngButtonModule } from "src/app/components/chart-export-png-btn/chart-export-png-btn.module";

@NgModule({
  imports: [
    SharedModule,
    DashboardsRoutingModule,
    ChooseSellerModule,
    PriceChartModule,
    SpinnerModule,
    ProductTableModule,
    ChartExportPngButtonModule,
    ChartModule,
    SelectButtonModule
  ],
  declarations: [
    DashboardComponent
  ],
  exports: [
    DashboardComponent
  ]
})
export class DashboardModule {

}

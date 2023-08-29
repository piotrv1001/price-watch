import { NgModule } from "@angular/core";

import { DashboardsRoutingModule } from "./dashboard-routing.module";

import { DashboardComponent } from "./dashboard.component";

import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";
import { NewProductsModule } from "src/app/components/new-products/new-products.module";
import { PriceChangesTableModule } from "src/app/components/price-changes-table/price-changes-table.module";
import { HistogramModule } from "src/app/components/histogram/histogram.module";
import { PriceChartModule } from "src/app/components/price-chart/price-chart.module";

@NgModule({
  imports: [
    DashboardsRoutingModule,
    NewProductsModule,
    ChooseSellerModule,
    PriceChangesTableModule,
    HistogramModule,
    PriceChartModule
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

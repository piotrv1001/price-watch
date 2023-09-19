import { NgModule } from "@angular/core";

import { SellersRoutingModule } from "./sellers-routing.module";

import { SellersComponent } from "./sellers.component";

import { ButtonModule } from "primeng/button";
import { ScrollPanelModule } from 'primeng/scrollpanel';

import { SharedModule } from "src/app/shared/shared.module";
import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";
import { SpinnerModule } from "src/app/components/spinner/spinner.module";
import { NoDataPlaceHolderModule } from "src/app/components/no-data-placeholder/no-data-placeholder.module";
import { ProductNameWithSellerModule } from "src/app/components/product-name-with-seller/product-name-with-seller.module";
import { ProductTableModule } from "src/app/components/product-table/product-table.module";
import { ProductTimelineModule } from "src/app/components/product-timeline/product-timeline.module";

@NgModule({
  imports: [
    SellersRoutingModule,
    SharedModule,
    ChooseSellerModule,
    SpinnerModule,
    NoDataPlaceHolderModule,
    ProductNameWithSellerModule,
    ButtonModule,
    ProductTableModule,
    ProductTimelineModule,
    ScrollPanelModule
  ],
  declarations: [
    SellersComponent
  ]
})
export class SellersModule {

}

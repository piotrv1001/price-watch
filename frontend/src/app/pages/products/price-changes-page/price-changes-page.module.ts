import { NgModule } from "@angular/core";

import { PriceChangesPageComponent } from "./price-changes-page.component";

import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";
import { PriceChangesTableModule } from "src/app/components/price-changes-table/price-changes-table.module";

@NgModule({
  imports: [
    ChooseSellerModule,
    PriceChangesTableModule
  ],
  declarations: [
    PriceChangesPageComponent
  ]
})
export class PriceChangesPageModule {

}

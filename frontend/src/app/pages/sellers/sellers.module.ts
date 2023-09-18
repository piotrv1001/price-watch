import { NgModule } from "@angular/core";

import { SellersRoutingModule } from "./sellers-routing.module";

import { SellersComponent } from "./sellers.component";

import { SharedModule } from "src/app/shared/shared.module";
import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";

@NgModule({
  imports: [
    SellersRoutingModule,
    SharedModule,
    ChooseSellerModule
  ],
  declarations: [
    SellersComponent
  ]
})
export class SellersModule {

}

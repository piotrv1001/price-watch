import { NgModule } from "@angular/core";

import { ProductNameWithSellerComponent } from "./product-name-with-seller.component";

import { SharedModule } from "src/app/shared/shared.module";
import { PipeModule } from "src/app/pipes/pipe.module";

@NgModule({
  declarations: [
    ProductNameWithSellerComponent
  ],
  imports: [
    SharedModule,
    PipeModule
  ],
  exports: [
    ProductNameWithSellerComponent
  ]
})
export class ProductNameWithSellerModule {

}

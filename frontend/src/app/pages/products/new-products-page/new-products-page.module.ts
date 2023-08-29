import { NgModule } from "@angular/core";

import { NewProductsPageComponent } from "./new-products-page.component";

import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";
import { NewProductsModule } from "src/app/components/new-products/new-products.module";

@NgModule({
  imports: [
    ChooseSellerModule,
    NewProductsModule
  ],
  declarations: [
    NewProductsPageComponent
  ]
})
export class NewProductsPageModule {

}

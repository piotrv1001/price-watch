import { NgModule } from "@angular/core";

import { TopProductsPageComponent } from "./top-products-page.component";

import { SharedModule } from "src/app/shared/shared.module";

import { DropdownModule } from "primeng/dropdown";

import { ProductTableModule } from "src/app/components/product-table/product-table.module";
import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";
import { SpinnerModule } from "src/app/components/spinner/spinner.module";

@NgModule({
  imports: [
    SharedModule,
    ProductTableModule,
    ChooseSellerModule,
    SpinnerModule,
    DropdownModule
  ],
  declarations: [
    TopProductsPageComponent
  ]
})
export class TopProductsPageModule {

}

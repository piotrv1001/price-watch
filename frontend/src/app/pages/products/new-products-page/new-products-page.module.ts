import { NgModule } from "@angular/core";

import { NewProductsPageComponent } from "./new-products-page.component";

import { SharedModule } from "src/app/shared/shared.module";
import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";
import { SpinnerModule } from "src/app/components/spinner/spinner.module";
import { DateRangeWithOptionsModule } from "src/app/components/date-range-with-options/date-range-with-options.module";
import { ProductTableModule } from "src/app/components/product-table/product-table.module";

@NgModule({
  imports: [
    SharedModule,
    ChooseSellerModule,
    SpinnerModule,
    DateRangeWithOptionsModule,
    ProductTableModule
  ],
  declarations: [
    NewProductsPageComponent
  ]
})
export class NewProductsPageModule {

}

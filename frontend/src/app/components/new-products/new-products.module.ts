import { NgModule } from "@angular/core";

import { NewProductsComponent } from "./new-products.component";

import { DateRangeWithOptionsModule } from "../date-range-with-options/date-range-with-options.module";
import { ProductTableModule } from "../product-table/product-table.module";

@NgModule({
  imports: [
    DateRangeWithOptionsModule,
    ProductTableModule
  ],
  declarations: [
    NewProductsComponent
  ],
  exports: [
    NewProductsComponent
  ]
})
export class NewProductsModule {

}

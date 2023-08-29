import { NgModule } from "@angular/core";

import { PriceChangesTableComponent } from "./price-changes-table.component";

import { DateRangeWithOptionsModule } from "../date-range-with-options/date-range-with-options.module";
import { ProductTableModule } from "../product-table/product-table.module";

@NgModule({
  imports: [
    DateRangeWithOptionsModule,
    ProductTableModule
  ],
  declarations: [
    PriceChangesTableComponent
  ],
  exports: [
    PriceChangesTableComponent
  ]
})
export class PriceChangesTableModule {

}

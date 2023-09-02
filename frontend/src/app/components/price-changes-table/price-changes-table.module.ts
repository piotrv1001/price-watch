import { NgModule } from "@angular/core";

import { PriceChangesTableComponent } from "./price-changes-table.component";

import { SharedModule } from "src/app/shared/shared.module";
import { DateRangeWithOptionsModule } from "../date-range-with-options/date-range-with-options.module";
import { ProductTableModule } from "../product-table/product-table.module";

@NgModule({
  imports: [
    SharedModule,
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

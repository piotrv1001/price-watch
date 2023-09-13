import { NgModule } from "@angular/core";

import { PricePageComponent } from "./price-page.component";

import { SharedModule } from "src/app/shared/shared.module";
import { ProductMultiSelectModule } from "src/app/components/product-multi-select/product-multi-select.module";
import { SpinnerModule } from "src/app/components/spinner/spinner.module";
import { ProductFilterModule } from "src/app/components/product-filter/product-filter.module";
import { ProductTableModule } from "src/app/components/product-table/product-table.module";

@NgModule({
  imports: [
    SharedModule,
    ProductMultiSelectModule,
    ProductTableModule,
    SpinnerModule,
    ProductFilterModule
  ],
  declarations: [
    PricePageComponent
  ],
  exports: [
    PricePageComponent
  ]
})
export class PricePageModule {

}

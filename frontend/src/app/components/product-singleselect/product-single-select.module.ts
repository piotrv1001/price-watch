import { NgModule } from "@angular/core";

import { ProductSingleSelectComponent } from "./product-single-select.component";

import { DropdownModule } from "primeng/dropdown";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    DropdownModule
  ],
  declarations: [
    ProductSingleSelectComponent
  ],
  exports: [
    ProductSingleSelectComponent
  ]
})
export class ProductSingleSelectModule {

}

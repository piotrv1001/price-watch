import { NgModule } from "@angular/core";

import { ProductMultiSelectComponent } from "./product-multi-select.component";

import { MultiSelectModule } from 'primeng/multiselect';

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    MultiSelectModule
  ],
  declarations: [
    ProductMultiSelectComponent
  ],
  exports: [
    ProductMultiSelectComponent
  ]
})
export class ProductMultiSelectModule {

}

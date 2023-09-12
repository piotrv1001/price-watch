import { NgModule } from "@angular/core";

import { ProductFilterComponent } from "./product-filter.component";
import { StatusFilterComponent } from "./status-filter/status-filter.component";
import { PriceFilterComponent } from "./price-filter/price-filter.component";

import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { InputNumberModule } from 'primeng/inputnumber';

import { SharedModule } from "src/app/shared/shared.module";
import { ChooseSellerModule } from "../choose-seller/choose-seller.module";

@NgModule({
  imports: [
    SharedModule,
    ChooseSellerModule,
    DropdownModule,
    MultiSelectModule,
    InputNumberModule
  ],
  declarations: [
    ProductFilterComponent,
    StatusFilterComponent,
    PriceFilterComponent
  ],
  exports: [
    ProductFilterComponent,
    StatusFilterComponent,
    PriceFilterComponent
  ]
})
export class ProductFilterModule {

}

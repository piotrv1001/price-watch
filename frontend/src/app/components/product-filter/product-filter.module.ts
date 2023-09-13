import { NgModule } from "@angular/core";

import { ProductFilterComponent } from "./product-filter.component";
import { StatusFilterComponent } from "./status-filter/status-filter.component";
import { RangeFilterComponent } from "./range-filter/range-filter.component";
import { PromoFilterComponent } from "./promo-filter/promo-filter.component";

import { DropdownModule } from "primeng/dropdown";
import { MultiSelectModule } from "primeng/multiselect";
import { InputNumberModule } from 'primeng/inputnumber';
import { SelectButtonModule } from 'primeng/selectbutton';
import { CheckboxModule } from 'primeng/checkbox';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from "primeng/button";

import { SharedModule } from "src/app/shared/shared.module";
import { ChooseSellerModule } from "../choose-seller/choose-seller.module";

@NgModule({
  imports: [
    SharedModule,
    ChooseSellerModule,
    DropdownModule,
    MultiSelectModule,
    InputNumberModule,
    SelectButtonModule,
    CheckboxModule,
    PanelModule,
    ButtonModule
  ],
  declarations: [
    ProductFilterComponent,
    StatusFilterComponent,
    RangeFilterComponent,
    PromoFilterComponent
  ],
  exports: [
    ProductFilterComponent,
    StatusFilterComponent,
    RangeFilterComponent,
    PromoFilterComponent
  ]
})
export class ProductFilterModule {

}

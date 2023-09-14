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
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from "primeng/inputtext";

import { SharedModule } from "src/app/shared/shared.module";
import { SellerMultiSelectModule } from "../seller-multi-select/seller-multi-select.module";

@NgModule({
  imports: [
    SharedModule,
    SellerMultiSelectModule,
    DropdownModule,
    MultiSelectModule,
    InputNumberModule,
    SelectButtonModule,
    CheckboxModule,
    PanelModule,
    ButtonModule,
    OverlayPanelModule,
    InputTextModule
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

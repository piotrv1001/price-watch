import { NgModule } from '@angular/core';

import { PriceLegendComponent } from './price-legend.component';

import { ButtonModule } from 'primeng/button';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProductNameWithSellerModule } from './../product-name-with-seller/product-name-with-seller.module';

@NgModule({
  imports: [
    SharedModule,
    ButtonModule,
    ProductNameWithSellerModule
  ],
  declarations: [
    PriceLegendComponent
  ],
  exports: [
    PriceLegendComponent
  ]
})
export class PriceLegendModule {

}

import { NgModule } from '@angular/core';

import { PriceLegendComponent } from './price-legend.component';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule
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

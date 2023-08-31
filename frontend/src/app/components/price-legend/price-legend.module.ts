import { NgModule } from '@angular/core';

import { PriceLegendComponent } from './price-legend.component';

import { ButtonModule } from 'primeng/button';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    ButtonModule
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

import { NgModule } from '@angular/core';

import { PriceChartDialogComponent } from './price-chart-dialog.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { PriceChartModule } from 'src/app/components/price-chart/price-chart.module';
import { PriceLegendModule } from '../price-legend/price-legend.module';

@NgModule({
  declarations: [
    PriceChartDialogComponent
  ],
  imports: [
    SharedModule,
    PriceChartModule,
    PriceLegendModule
  ],
  exports: [
    PriceChartDialogComponent,
    PriceChartModule,
    PriceLegendModule
  ]
})
export class PriceChartDialogModule {

}

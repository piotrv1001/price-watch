import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { ProductTableComponent } from './product-table/product-table.component';
import { HistogramComponent } from './histogram/histogram.component';
import { NewProductsComponent } from './new-products/new-products.component';
import { PriceChangesTableComponent } from './price-changes-table/price-changes-table.component';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { StripPricePipe } from '../pipes/strip-price.pipe';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    TableModule,
    ChartModule,
    ButtonModule
  ],
  declarations: [
    ProductTableComponent,
    HistogramComponent,
    NewProductsComponent,
    PriceChangesTableComponent,
    StripPricePipe
  ],
  exports: [
    ProductTableComponent,
    HistogramComponent,
    NewProductsComponent,
    PriceChangesTableComponent,
    StripPricePipe
  ],
})
export class ComponentsModule {

}

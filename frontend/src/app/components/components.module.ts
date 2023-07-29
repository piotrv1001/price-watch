import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

import { ProductTableComponent } from './product-table/product-table.component';
import { HistogramComponent } from './histogram/histogram.component';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';

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
    HistogramComponent
  ],
  exports: [
    ProductTableComponent,
    HistogramComponent
  ],
})
export class ComponentsModule {

}

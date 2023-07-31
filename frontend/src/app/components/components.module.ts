import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';

// Components
import { ProductTableComponent } from './product-table/product-table.component';
import { HistogramComponent } from './histogram/histogram.component';
import { PriceChartComponent } from './price-chart/price-chart.component';
import { NewProductsComponent } from './new-products/new-products.component';

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
    HistogramComponent,
    PriceChartComponent,
    NewProductsComponent
  ],
  exports: [
    ProductTableComponent,
    HistogramComponent,
    PriceChartComponent,
    NewProductsComponent
  ],
})
export class ComponentsModule {

}

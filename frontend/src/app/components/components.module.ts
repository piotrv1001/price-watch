import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'

// Components
import { ProductTableComponent } from './product-table/product-table.component';
import { HistogramComponent } from './histogram/histogram.component';
import { PriceChartComponent } from './price-chart/price-chart.component';
import { NewProductsComponent } from './new-products/new-products.component';
import { PriceChangesTableComponent } from './price-changes-table/price-changes-table.component';
import { ChooseSellerComponent } from './choose-seller/choose-seller.component';
import { StripPricePipe } from '../pipes/strip-price.pipe';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { DateRangeComponent } from './date-range/date-range.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    TableModule,
    ChartModule,
    ButtonModule,
    DropdownModule,
    FormsModule,
    CalendarModule
  ],
  declarations: [
    ProductTableComponent,
    HistogramComponent,
    PriceChartComponent,
    NewProductsComponent,
    PriceChangesTableComponent,
    StripPricePipe,
    ChooseSellerComponent,
    DateRangeComponent
  ],
  exports: [
    ProductTableComponent,
    HistogramComponent,
    PriceChartComponent,
    NewProductsComponent,
    PriceChangesTableComponent,
    StripPricePipe,
    ButtonModule,
    ChooseSellerComponent
  ],
})
export class ComponentsModule {

}

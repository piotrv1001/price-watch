import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Components
import { ProductTableComponent } from './product-table/product-table.component';
import { HistogramComponent } from './histogram/histogram.component';
import { PriceChartComponent } from './price-chart/price-chart.component';
import { NewProductsComponent } from './new-products/new-products.component';
import { PriceChangesTableComponent } from './price-changes-table/price-changes-table.component';
import { ChooseSellerComponent } from './choose-seller/choose-seller.component';
import { StripPricePipe } from '../pipes/strip-price.pipe';
import { ExcelExportBtnComponent } from './excel-export-btn/excel-export-btn.component';
import { DateRangeComponent } from './date-range/date-range.component';
import { PdfExportBtnComponent } from './pdf-export-btn/pdf-export-btn.component';
import { ChartExportPngBtnComponent } from './chart-export-png-btn/chart-export-png-btn.component';
import { DateRangeWithOptionsComponent } from './date-range-with-options/date-range-with-options.component';

// PrimeNG
import { TableModule } from 'primeng/table';
import { ChartModule } from 'primeng/chart';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { CalendarModule } from 'primeng/calendar';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ChartModule,
    ButtonModule,
    DropdownModule,
    CalendarModule,
    TooltipModule,
    InputTextModule,
    ProgressBarModule
  ],
  declarations: [
    ProductTableComponent,
    HistogramComponent,
    PriceChartComponent,
    NewProductsComponent,
    PriceChangesTableComponent,
    StripPricePipe,
    ChooseSellerComponent,
    DateRangeComponent,
    ExcelExportBtnComponent,
    PdfExportBtnComponent,
    ChartExportPngBtnComponent,
    DateRangeWithOptionsComponent
  ],
  exports: [
    ProductTableComponent,
    HistogramComponent,
    PriceChartComponent,
    NewProductsComponent,
    PriceChangesTableComponent,
    StripPricePipe,
    ButtonModule,
    ChooseSellerComponent,
    ExcelExportBtnComponent,
    TooltipModule,
    InputTextModule,
    ProgressBarModule,
    PdfExportBtnComponent,
    ChartExportPngBtnComponent,
    DateRangeWithOptionsComponent
  ]
})
export class ComponentsModule {

}

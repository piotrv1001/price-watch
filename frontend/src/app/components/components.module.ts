import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule } from '@angular/common';
import { TableModule } from 'primeng/table';
import { ProductTableComponent } from './product-table/product-table.component';

@NgModule({
  imports: [
    BrowserModule,
    CommonModule,
    TableModule
  ],
  declarations: [ProductTableComponent],
  exports: [ProductTableComponent],
})
export class ComponentsModule {

}

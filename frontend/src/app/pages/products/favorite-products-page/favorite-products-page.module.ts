import { NgModule } from '@angular/core';

import { FavoriteProductsPageComponent } from './favorite-products-page.component';

import { SharedModule } from 'src/app/shared/shared.module';
import { ProductTableModule } from 'src/app/components/product-table/product-table.module';
import { SpinnerModule } from 'src/app/components/spinner/spinner.module';

@NgModule({
  imports: [
    SharedModule,
    ProductTableModule,
    SpinnerModule
  ],
  declarations: [
    FavoriteProductsPageComponent
  ]
})
export class FavoriteProductsPageModule {

}

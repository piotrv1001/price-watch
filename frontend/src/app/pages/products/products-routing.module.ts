import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { NewProductsPageComponent } from './new-products-page/new-products-page.component';
import { PriceBucketsPageComponent } from './price-buckets-page/price-buckets-page.component';
import { PriceChangesPageComponent } from './price-changes-page/price-changes-page.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'new-products', component: NewProductsPageComponent, loadChildren: () => import('./new-products-page/new-products-page.module').then(m => m.NewProductsPageModule )},
    { path: 'price-buckets', component: PriceBucketsPageComponent, loadChildren: () => import('./price-buckets-page/price-buckets-page.module').then(m => m.PriceBucketsPageModule )},
    { path: 'price-changes', component: PriceChangesPageComponent, loadChildren: () => import('./price-changes-page/price-changes-page.module').then(m => m.PriceChangesPageModule ) }
  ])],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }

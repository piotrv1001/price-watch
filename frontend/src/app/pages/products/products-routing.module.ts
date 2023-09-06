import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PricePageComponent } from './price-page/price-page.component';
import { NewProductsPageComponent } from './new-products-page/new-products-page.component';
import { PriceBucketsPageComponent } from './price-buckets-page/price-buckets-page.component';
import { PriceChangesPageComponent } from './price-changes-page/price-changes-page.component';
import { TimelinePageComponent } from './timeline-page/timeline-page.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'prices', component: PricePageComponent, loadChildren: () => import('./price-page/price-page.module').then(m => m.PricePageModule ) },
    { path: 'new-products', component: NewProductsPageComponent, loadChildren: () => import('./new-products-page/new-products-page.module').then(m => m.NewProductsPageModule )},
    { path: 'price-buckets', component: PriceBucketsPageComponent, loadChildren: () => import('./price-buckets-page/price-buckets-page.module').then(m => m.PriceBucketsPageModule )},
    { path: 'price-changes', component: PriceChangesPageComponent, loadChildren: () => import('./price-changes-page/price-changes-page.module').then(m => m.PriceChangesPageModule ) },
    { path: 'timeline', component: TimelinePageComponent, loadChildren: () => import('./timeline-page/timeline-page.module').then(m => m.TimelinePageModule ) }
  ])],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }

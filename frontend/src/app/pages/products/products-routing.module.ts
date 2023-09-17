import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { PricePageComponent } from './price-page/price-page.component';
import { NewProductsPageComponent } from './new-products-page/new-products-page.component';
import { PriceBucketsPageComponent } from './price-buckets-page/price-buckets-page.component';
import { PriceChangesPageComponent } from './price-changes-page/price-changes-page.component';
import { TimelinePageComponent } from './timeline-page/timeline-page.component';
import { FavoriteProductsPageComponent } from './favorite-products-page/favorite-products-page.component';
import { authGuard } from 'src/app/guards/auth.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'prices',
      component: PricePageComponent,
      loadChildren: () => import('./price-page/price-page.module').then(m => m.PricePageModule ),
      canActivate: [authGuard]
    },
    {
      path: 'new-products',
      component: NewProductsPageComponent,
      loadChildren: () => import('./new-products-page/new-products-page.module').then(m => m.NewProductsPageModule ),
      canActivate: [authGuard]
    },
    {
      path: 'price-buckets',
      component: PriceBucketsPageComponent,
      loadChildren: () => import('./price-buckets-page/price-buckets-page.module').then(m => m.PriceBucketsPageModule ),
      canActivate: [authGuard]
    },
    {
      path: 'price-changes',
      component: PriceChangesPageComponent,
      loadChildren: () => import('./price-changes-page/price-changes-page.module').then(m => m.PriceChangesPageModule ),
      canActivate: [authGuard]
    },
    {
      path: 'timeline',
      component: TimelinePageComponent,
      loadChildren: () => import('./timeline-page/timeline-page.module').then(m => m.TimelinePageModule ),
      canActivate: [authGuard]
    },
    {
      path: 'favorite-products',
      component: FavoriteProductsPageComponent,
      loadChildren: () => import('./favorite-products-page/favorite-products-page.module').then(m => m.FavoriteProductsPageModule ),
      canActivate: [authGuard]
    }
  ])],
  exports: [RouterModule]
})
export class ProductsRoutingModule { }

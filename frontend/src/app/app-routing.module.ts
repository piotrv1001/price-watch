import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';

const routes: Routes = [
  {
    path: '', component: AppLayoutComponent,
    children: [
      { path: '', loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule) },
      { path: 'account', loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule) },
      { path: 'new-products', loadChildren: () => import('./pages/new-products-page/new-products-page.module').then(m => m.NewProductsPageModule) },
      { path: 'price-buckets', loadChildren: () => import('./pages/price-buckets-page/price-buckets-page.module').then(m => m.PriceBucketsPageModule) },
      { path: 'price-changes', loadChildren: () => import('./pages/price-changes-page/price-changes-page.module').then(m => m.PriceChangesPageModule) },
      { path: 'email-config', loadChildren: () => import('./pages/email-config-page/email-config-page.module').then(m => m.EmailConfigPageModule) }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

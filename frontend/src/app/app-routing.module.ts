import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AppLayoutComponent } from './layout/app.layout.component';
import { authGuard } from './guards/auth.guard';

const routes: Routes = [
  {
    path: '',
    component: AppLayoutComponent,
    children: [
      {
        path: '',
        loadChildren: () => import('./pages/dashboard/dashboard.module').then(m => m.DashboardModule),
        canActivate: [authGuard]
      },
      {
        path: 'account',
        loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule),
        canActivate: [authGuard]
      },
      {
        path: 'products',
        loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule),
        canActivate: [authGuard]
      },
      {
        path: 'settings',
        loadChildren: () => import('./pages/settings/settings.module').then(m => m.SettingsModule),
        canActivate: [authGuard]
      }
    ],
  },
  {
    path: 'login',
    loadChildren: () => import('./components/login/login.module').then(m => m.LoginModule)
  },
  {
    path: 'register',
    loadChildren: () => import('./components/register/register.module').then(m => m.RegisterModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

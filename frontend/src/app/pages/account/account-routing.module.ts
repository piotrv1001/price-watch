import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { authGuard } from 'src/app/guards/auth.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'profile',
      component: ProfileComponent,
      loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule),
      canActivate: [authGuard]
    },
    {
      path: 'settings',
      component: SettingsComponent,
      loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule),
      canActivate: [authGuard]
    }
  ])],
  exports: [RouterModule]
})
export class AccountRoutingModule { }

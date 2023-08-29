import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: 'profile', component: ProfileComponent, loadChildren: () => import('./profile/profile.module').then(m => m.ProfileModule) },
    { path: 'settings', component: SettingsComponent, loadChildren: () => import('./settings/settings.module').then(m => m.SettingsModule) }
  ])],
  exports: [RouterModule]
})
export class AccountRoutingModule { }

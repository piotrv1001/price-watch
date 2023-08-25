import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'profile', component: ProfileComponent },
        { path: 'settings', component: SettingsComponent }
    ])],
    exports: [RouterModule]
})
export class AccountRoutingModule { }

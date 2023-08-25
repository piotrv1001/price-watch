import { NgModule } from "@angular/core";
import { AccountRoutingModule } from "./account-routing.module";
import { ProfileComponent } from './profile/profile.component';
import { SettingsComponent } from './settings/settings.component';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    AccountRoutingModule,
    SharedModule
  ],
  declarations: [
    ProfileComponent,
    SettingsComponent
  ]
})
export class AccountModule {

}

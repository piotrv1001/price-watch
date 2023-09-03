import { NgModule } from "@angular/core";

import { ProfileComponent } from './profile.component';

import { ButtonModule } from "primeng/button";
import { InputTextModule } from "primeng/inputtext";

import { SharedModule } from "src/app/shared/shared.module";
import { ProfilePictureModule } from "src/app/components/profile-picture/profile-picture.module";
import { SpinnerModule } from "src/app/components/spinner/spinner.module";

@NgModule({
  imports: [
    SharedModule,
    ProfilePictureModule,
    ButtonModule,
    InputTextModule,
    SpinnerModule
  ],
  declarations: [
    ProfileComponent
  ],
  exports: [
    ProfileComponent
  ]
})
export class ProfileModule {

}

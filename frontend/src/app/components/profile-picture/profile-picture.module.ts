import { NgModule } from "@angular/core";

import { ProfilePictureComponent } from "./profile-picture.component";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule
  ],
  declarations: [
    ProfilePictureComponent
  ],
  exports: [
    ProfilePictureComponent
  ]
})
export class ProfilePictureModule {

}

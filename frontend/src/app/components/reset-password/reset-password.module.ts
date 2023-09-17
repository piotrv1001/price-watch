import { NgModule } from "@angular/core";

import { ResetPasswordRoutingModule } from "./reset-password-routing.module";

import { ResetPasswordComponent } from "./reset-password.component";

import { ButtonModule } from "primeng/button";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    ResetPasswordRoutingModule,
    SharedModule,
    ButtonModule
  ],
  declarations: [
    ResetPasswordComponent
  ]
})
export class ResetPasswordModule {

}

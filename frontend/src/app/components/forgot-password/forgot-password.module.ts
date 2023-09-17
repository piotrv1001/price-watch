import { NgModule } from "@angular/core";

import { ForgotPasswordRoutingModule } from "./forgot-password-routing.module";

import { ForgotPasswordComponent } from "./forgot-password.component";

import { ButtonModule } from "primeng/button";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    ForgotPasswordRoutingModule,
    ButtonModule
  ],
  declarations: [
    ForgotPasswordComponent
  ]
})
export class ForgotPasswordModule {

}

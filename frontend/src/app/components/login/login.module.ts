import { NgModule } from "@angular/core";

import { LoginRoutingModule } from "./login-routing.module";

import { LoginComponent } from "./login.component";

import { ButtonModule } from "primeng/button";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    LoginRoutingModule,
    ButtonModule
  ],
  declarations: [
    LoginComponent
  ],
  exports: [
    LoginComponent
  ]
})
export class LoginModule {

}

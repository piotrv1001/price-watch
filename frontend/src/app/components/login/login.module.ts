import { NgModule } from "@angular/core";

import { LoginComponent } from "./login.component";

import { ButtonModule } from "primeng/button";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
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

import { NgModule } from "@angular/core";

import { RegisterRoutingModule } from "./register-routing.module";

import { RegisterComponent } from "./register.component";

import { ButtonModule } from "primeng/button";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    RegisterRoutingModule,
    ButtonModule
  ],
  declarations: [
    RegisterComponent
  ],
  exports: [
    RegisterComponent
  ]
})
export class RegisterModule {

}

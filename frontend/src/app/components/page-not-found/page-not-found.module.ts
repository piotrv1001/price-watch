import { NgModule } from "@angular/core";

import { PageNotFoundRoutingModule } from "./page-not-found-routing.module";

import { PageNotFoundComponent } from "./page-not-found.component";

import { ButtonModule } from "primeng/button";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    PageNotFoundRoutingModule,
    SharedModule,
    ButtonModule
  ],
  declarations: [
    PageNotFoundComponent
  ]
})
export class PageNotFoundModule {

}

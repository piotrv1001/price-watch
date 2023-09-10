import { NgModule } from "@angular/core";

import { NoDataPlaceholderComponent } from "./no-data-placeholder.component";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  declarations:[
    NoDataPlaceholderComponent
  ],
  imports: [
    SharedModule
  ],
  exports: [
    NoDataPlaceholderComponent
  ]
})
export class NoDataPlaceHolderModule {

}

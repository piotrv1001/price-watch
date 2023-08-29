import { NgModule } from "@angular/core";

import { DateRangeWithOptionsComponent } from "./date-range-with-options.component";

import { DateRangeModule } from "../date-range/date-range.module";

import { DropdownModule } from "primeng/dropdown";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    DateRangeModule,
    DropdownModule
  ],
  declarations: [
    DateRangeWithOptionsComponent
  ],
  exports: [
    DateRangeWithOptionsComponent
  ]
})
export class DateRangeWithOptionsModule {

}

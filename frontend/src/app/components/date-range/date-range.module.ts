import { NgModule } from "@angular/core";

import { DateRangeComponent } from "./date-range.component";

import { CalendarModule } from "primeng/calendar";
import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    CalendarModule
  ],
  declarations: [
    DateRangeComponent
  ],
  exports: [
    DateRangeComponent
  ]
})
export class DateRangeModule {

}

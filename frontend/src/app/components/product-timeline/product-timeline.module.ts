import { NgModule } from "@angular/core";

import { ProductTimelineComponent } from "./product-timeline.component";

import { TimelineModule } from "primeng/timeline";

import { SharedModule } from "src/app/shared/shared.module";

@NgModule({
  imports: [
    SharedModule,
    TimelineModule
  ],
  declarations: [
    ProductTimelineComponent
  ],
  exports: [
    ProductTimelineComponent
  ]
})
export class ProductTimelineModule {

}

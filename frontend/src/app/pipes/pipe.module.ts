import { NgModule } from "@angular/core";

import { PadStartPipe } from "./pad-start.pipe";
import { StripPricePipe } from "./strip-price.pipe";

@NgModule({
  declarations: [
    PadStartPipe,
    StripPricePipe
  ],
  exports: [
    PadStartPipe,
    StripPricePipe
  ]
})
export class PipeModule {

}

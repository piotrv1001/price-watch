import { NgModule } from "@angular/core";

import { PriceBucketsPageComponent } from "./price-buckets-page.component";

import { ChooseSellerModule } from "src/app/components/choose-seller/choose-seller.module";
import { HistogramModule } from "src/app/components/histogram/histogram.module";

@NgModule({
  imports: [
    ChooseSellerModule,
    HistogramModule
  ],
  declarations: [
    PriceBucketsPageComponent
  ]
})
export class PriceBucketsPageModule {

}

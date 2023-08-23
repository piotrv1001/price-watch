import { NgModule } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { PriceBucketsPageRoutingModule } from "./price-buckets-page-routing.module";
import { PriceBucketsPageComponent } from "./price-buckets-page.component";

@NgModule({
  imports: [
    ComponentsModule,
    PriceBucketsPageRoutingModule
  ],
  declarations: [
    PriceBucketsPageComponent
  ]
})
export class PriceBucketsPageModule {

}

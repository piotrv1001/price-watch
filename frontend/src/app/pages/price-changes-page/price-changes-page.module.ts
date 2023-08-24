import { NgModule } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { PriceChangesPageComponent } from "./price-changes-page.component";
import { PriceChangesPageRoutingModule } from "./price-changes-page-routing.module";

@NgModule({
  imports: [
    ComponentsModule,
    PriceChangesPageRoutingModule
  ],
  declarations: [
    PriceChangesPageComponent
  ]
})
export class PriceChangesPageModule {

}

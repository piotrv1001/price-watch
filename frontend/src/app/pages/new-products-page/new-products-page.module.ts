import { NgModule } from "@angular/core";
import { ComponentsModule } from "src/app/components/components.module";
import { NewProductsPageComponent } from "./new-products-page.component";
import { NewProductsPageRoutingModule } from "./new-products-page-routing.module";

@NgModule({
  imports: [
    ComponentsModule,
    NewProductsPageRoutingModule
  ],
  declarations: [
    NewProductsPageComponent
  ]
})
export class NewProductsPageModule {

}

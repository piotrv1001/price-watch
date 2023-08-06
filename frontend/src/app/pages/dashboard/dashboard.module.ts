import { NgModule } from "@angular/core";
import { DashboardComponent } from "./dashboard.component";
import { ComponentsModule } from "src/app/components/components.module";
import { DashboardsRoutingModule } from "./dashboard-routing.module";

@NgModule({
  imports: [
    ComponentsModule,
    DashboardsRoutingModule
  ],
  declarations: [
    DashboardComponent
  ],
})
export class DashboardModule {

}

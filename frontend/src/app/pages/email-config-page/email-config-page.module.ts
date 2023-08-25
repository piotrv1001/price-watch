import { NgModule } from '@angular/core';
import { EmailConfigPageRoutingModule } from './email-config-page-routing.module';
import { ComponentsModule } from 'src/app/components/components.module';
import { EmailConfigPageComponent } from './email-config-page.component';

@NgModule({
  imports: [
    EmailConfigPageRoutingModule,
    ComponentsModule
  ],
  declarations: [
    EmailConfigPageComponent
  ]
})
export class EmailConfigPageModule {}

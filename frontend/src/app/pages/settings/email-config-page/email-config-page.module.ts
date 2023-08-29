import { NgModule } from '@angular/core';

import { EmailConfigPageComponent } from './email-config-page.component';

import { DropdownModule } from 'primeng/dropdown';
import { InputSwitchModule } from 'primeng/inputswitch';
import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { InputTextModule } from 'primeng/inputtext';

import { HoursMinutesModule } from 'src/app/components/hours-minutes/hours-minutes.module';

@NgModule({
  imports: [
    SharedModule,
    DropdownModule,
    InputSwitchModule,
    ButtonModule,
    HoursMinutesModule,
    InputTextModule
  ],
  declarations: [
    EmailConfigPageComponent
  ]
})
export class EmailConfigPageModule {}

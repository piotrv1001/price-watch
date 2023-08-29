import { NgModule } from '@angular/core';

import { HoursMinutesComponent } from './hours-minutes.component';

import { ButtonModule } from 'primeng/button';
import { SharedModule } from 'src/app/shared/shared.module';
import { PipeModule } from 'src/app/pipes/pipe.module';

@NgModule({
  imports: [
    SharedModule,
    ButtonModule,
    PipeModule
  ],
  declarations: [
    HoursMinutesComponent
  ],
  exports: [
    HoursMinutesComponent
  ]
})
export class HoursMinutesModule {

}

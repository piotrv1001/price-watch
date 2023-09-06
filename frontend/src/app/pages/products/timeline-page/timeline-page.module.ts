import { NgModule } from '@angular/core';

import { TimelinePageComponent } from './timeline-page.component';

import { TimelineModule } from 'primeng/timeline';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    TimelineModule
  ],
  declarations: [
    TimelinePageComponent
  ],
  exports: [
    TimelinePageComponent
  ]
})
export class TimelinePageModule {

}

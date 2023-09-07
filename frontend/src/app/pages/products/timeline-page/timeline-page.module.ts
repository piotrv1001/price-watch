import { NgModule } from '@angular/core';

import { TimelinePageComponent } from './timeline-page.component';

import { TimelineModule } from 'primeng/timeline';

import { SharedModule } from 'src/app/shared/shared.module';
import { SpinnerModule } from 'src/app/components/spinner/spinner.module';
import { ProductSingleSelectModule } from 'src/app/components/product-singleselect/product-single-select.module';

@NgModule({
  imports: [
    SharedModule,
    TimelineModule,
    SpinnerModule,
    ProductSingleSelectModule
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

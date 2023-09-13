import { NgModule } from '@angular/core';

import { SellerMultiSelectComponent } from './seller-multi-select.component';

import { MultiSelectModule } from 'primeng/multiselect';

import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [
    SellerMultiSelectComponent
  ],
  imports: [
    SharedModule,
    MultiSelectModule
  ],
  exports: [
    SellerMultiSelectComponent
  ]
})
export class SellerMultiSelectModule {

}

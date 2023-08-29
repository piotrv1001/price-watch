import { NgModule } from '@angular/core';

import { ChooseSellerComponent } from './choose-seller.component';

import { DropdownModule } from 'primeng/dropdown';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  imports: [
    SharedModule,
    DropdownModule
  ],
  declarations: [
    ChooseSellerComponent
  ],
  exports: [
    ChooseSellerComponent
  ]
})
export class ChooseSellerModule {

}

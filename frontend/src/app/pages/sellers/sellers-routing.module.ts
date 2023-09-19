import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SellersComponent } from './sellers.component';

@NgModule({
  imports: [RouterModule.forChild([
    { path: '', component: SellersComponent }
  ])],
  exports: [RouterModule]
})
export class SellersRoutingModule { }

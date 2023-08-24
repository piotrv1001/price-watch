import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PriceChangesPageComponent } from './price-changes-page.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PriceChangesPageComponent }
    ])],
    exports: [RouterModule]
})
export class PriceChangesPageRoutingModule { }

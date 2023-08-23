import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PriceBucketsPageComponent } from './price-buckets-page.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PriceBucketsPageComponent }
    ])],
    exports: [RouterModule]
})
export class PriceBucketsPageRoutingModule { }

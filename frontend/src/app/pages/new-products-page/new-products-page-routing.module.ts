import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { NewProductsPageComponent } from './new-products-page.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: NewProductsPageComponent }
    ])],
    exports: [RouterModule]
})
export class NewProductsPageRoutingModule { }

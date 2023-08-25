import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmailConfigPageComponent } from './email-config-page.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: EmailConfigPageComponent }
    ])],
    exports: [RouterModule]
})
export class EmailConfigPageRoutingModule { }

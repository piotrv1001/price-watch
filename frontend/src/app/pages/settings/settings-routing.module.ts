import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmailConfigPageComponent } from './email-config-page/email-config-page.component';


@NgModule({
  imports: [RouterModule.forChild([
    { path: 'email-config', component: EmailConfigPageComponent, loadChildren: () => import('./email-config-page/email-config-page.module').then(m => m.EmailConfigPageModule )},
  ])],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

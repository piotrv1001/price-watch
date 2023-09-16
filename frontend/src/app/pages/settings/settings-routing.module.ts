import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { EmailConfigPageComponent } from './email-config-page/email-config-page.component';
import { authGuard } from 'src/app/guards/auth.guard';

@NgModule({
  imports: [RouterModule.forChild([
    {
      path: 'email-config',
      component: EmailConfigPageComponent,
      loadChildren: () => import('./email-config-page/email-config-page.module').then(m => m.EmailConfigPageModule ),
      canActivate: [authGuard]
    }
  ])],
  exports: [RouterModule]
})
export class SettingsRoutingModule { }

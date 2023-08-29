import { NgModule } from '@angular/core';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AppLayoutModule } from './layout/app.layout.module';
import { initializeApp,provideFirebaseApp } from '@angular/fire/app';
import { environment } from '../environments/environment';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { BrowserModule } from '@angular/platform-browser';
import { httpInterceptorProviders } from './interceptors';
import { MessageService } from 'primeng/api';
import { SharedModule } from './shared/shared.module';
import { LoginModule } from './components/login/login.module';
import { RegisterModule } from './components/register/register.module';
import { ToastModule } from 'primeng/toast';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    SharedModule,
    AppRoutingModule,
    AppLayoutModule,
    LoginModule,
    RegisterModule,
    ToastModule,
    provideFirebaseApp(() => initializeApp(environment.firebase)),
    provideAuth(() => getAuth()),
  ],
  providers: [httpInterceptorProviders, MessageService],
  bootstrap: [AppComponent]
})
export class AppModule { }

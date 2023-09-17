import { from, of, switchMap } from 'rxjs';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { PrimeNGConfig } from 'primeng/api';
import { ToastService } from './services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  subs: Subscription[] = [];
  isFirebaseUser = false;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService,
    private router: Router,
    private translateService: TranslateService,
    private config: PrimeNGConfig,
    private toastService: ToastService
  ) {
    this.translateService.addLangs(['en', 'pl']);
    this.translateService.setDefaultLang('pl');
    const browserLang = translateService.getBrowserLang();
    const useLang = browserLang?.match(/en|pl/) ? browserLang : 'pl';
    translateService.use(useLang);
    this.subs.push(
      this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res))
    );
  }

  ngOnInit(): void {
    // this.validateJWT();
    this.observeFirebaseUser();
    this.observeSignOut();
    this.observeTokenExpired();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  private async signOut(): Promise<void> {
    if(this.isFirebaseUser) {
      await this.auth.signOut();
      this.authService.removeFirebaseToken();
    } else {
      this.subs.push(
        this.authService.logout().subscribe()
      );
    }
    this.router.navigate(['/login']);
  }

  private validateJWT(): void {
    this.subs.push(
      this.authService.isAuthenticated().subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: () => {
          if(!this.isFirebaseUser) {
            this.router.navigate(['/login']);
          }
        }
      })
    );
  }

  private observeFirebaseUser(): void {
    this.subs.push(
      this.user$.pipe(
        switchMap((user) => {
          if (user) {
            return from(user.getIdToken()).pipe(
              switchMap((idToken) => {
                this.authService.setFirebaseToken(idToken);
                return this.authService.verifyFirebaseToken(idToken);
              })
            );
          } else {
            return of(false);
          }
        })
      ).subscribe((verificationResult) => {
        this.isFirebaseUser = verificationResult;
        if(this.isFirebaseUser) {
          this.router.navigate(['/']);
        }
      })
    );
  }

  private observeSignOut(): void {
    this.subs.push(
      this.sharedService.getSignOut().subscribe(async () => {
        await this.signOut();
        this.router.navigate(['/login']);
      })
    );
  }

  private observeTokenExpired(): void {
    this.subs.push(
      this.authService.getTokenExpired().subscribe(async () => {
        await this.authService.logout();
        this.router.navigate(['/login']);
        this.toastService.errorMessage('error.tokenExpired');
      })
    );
  }
}

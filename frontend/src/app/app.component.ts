import { from, of, switchMap } from 'rxjs';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';
import { SharedService } from './services/shared.service';

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
  isAuthenticated = false;
  createNewAccount = false;

  constructor(
    private authService: AuthService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.validateJWT();
    this.observeFirebaseUser();
    this.observeAuth();
    this.observeSignOut();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  handleRegisterBtnClick(): void {
    this.createNewAccount = true;
  }

  handleLoginBtnClick(): void {
    this.createNewAccount = false;
  }

  private async signOut(): Promise<void> {
    if(this.isFirebaseUser) {
      await this.auth.signOut();
    }
    await this.authService.logout();
  }

  private validateJWT(): void {
    this.subs.push(
      this.authService.isAuthenticated().subscribe({
        next: () => {
          this.isAuthenticated = true;
        },
        error: () => {
          if(!this.isFirebaseUser) {
            this.isAuthenticated = false;
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
        this.isAuthenticated = verificationResult;
      })
    );
  }

  private observeSignOut(): void {
    this.subs.push(
      this.sharedService.getSignOut().subscribe(async () => {
        await this.signOut();
        this.isAuthenticated = false;
        this.createNewAccount = false;
      })
    );
  }

  private observeAuth(): void {
    this.subs.push(
      this.authService.getAuthObs().subscribe(auth => {
        this.isAuthenticated = auth;
      })
    );
  }
}

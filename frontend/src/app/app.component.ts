import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  subs: Subscription[] = [];
  isOAuthUser = false;

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.subs.push(
      this.user$.subscribe(user => {
        console.log('User: ', user);
        this.isOAuthUser = user != null;
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async signOut(): Promise<void> {
    if(this.isOAuthUser) {
      await this.auth.signOut();
    }
    await this.authService.logout();
  }
}

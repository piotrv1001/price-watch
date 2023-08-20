import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup, user } from '@angular/fire/auth';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit, OnDestroy {
  private auth: Auth = inject(Auth);
  user$ = user(this.auth);
  subs: Subscription[] = [];

  ngOnInit(): void {
    this.subs.push(
      this.user$.subscribe(user => {
        console.log('User: ', user);
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const idToken = await userCredential.user.getIdToken();
      console.log('Google sign in idToken: ', idToken);
    } catch(error) {
      console.log('Google sign in error: ', error);
    }
  }
}

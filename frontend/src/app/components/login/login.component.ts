import { Component, OnDestroy, OnInit, inject } from "@angular/core";
import { Auth, GoogleAuthProvider, signInWithPopup } from "@angular/fire/auth";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { Subscription } from "rxjs";
import { User } from "src/app/models/user/user";
import { AuthService } from "src/app/services/auth.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {
  formGroup?: FormGroup;
  subs: Subscription[] = [];
  private auth: Auth = inject(Auth);

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) {}

  get email(): string {
    return this.formGroup?.get('email')?.value;
  }

  get password(): string {
    return this.formGroup?.get('password')?.value;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  loginAsGuest(): void {
    const email = 'test';
    const password = 'test';
    this.login(email, password);
  }

  login(email = this.email, password = this.password): void {
    const user: User = { email, password};
    this.subs.push(
      this.authService.login(user).subscribe({
        next: () => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          if(error.status === 400) {
            this.toastService.errorMessage('error.invalidUsernameOrPassword');
          } else {
            this.toastService.handleError(error);
          }
        }
      })
    );
  }

  async signInWithGoogle(): Promise<void> {
    try {
      const provider = new GoogleAuthProvider();
      const userCredential = await signInWithPopup(this.auth, provider);
      const idToken = await userCredential.user.getIdToken();
      this.subs.push(
        this.authService.verifyFirebaseToken(idToken).subscribe({
          next: (authResult) => {
            if(authResult) {
              this.authService.setFirebaseToken(idToken);
              this.router.navigate(['/']);
            } else {
              this.toastService.errorMessage('Google sign in error');
            }
          },
          error: (error) => {
            this.toastService.handleError(error);
          }
        })
      );
    } catch(error) {
      this.toastService.errorMessage('Google sign in error');
    }
  }

  registerBtnClicked(): void {
    this.router.navigate(['/register']);
  }

  forgotBtnClicked(): void {
    this.router.navigate(['/forgot-password']);
  }
}

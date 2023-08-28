import { Component, EventEmitter, OnDestroy, OnInit, Output, inject } from "@angular/core";
import { Auth, GoogleAuthProvider, signInWithPopup } from "@angular/fire/auth";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
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
  @Output() registerBtnClick: EventEmitter<void> = new EventEmitter<void>();
  private auth: Auth = inject(Auth);

  constructor(
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

  login(): void {
    const user: User = { email: this.email, password: this.password };
    this.subs.push(
      this.authService.login(user).subscribe({
        next: () => {
          this.authService.authenticate();
        },
        error: (error) => {
          this.toastService.handleError(error);
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
              this.authService.authenticate();
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
    this.registerBtnClick.emit();
  }
}

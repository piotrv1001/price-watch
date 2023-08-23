import { EventEmitter, OnDestroy, Output, inject } from '@angular/core';
import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Auth, GoogleAuthProvider, signInWithPopup } from '@angular/fire/auth';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription, switchMap } from 'rxjs';
import { User } from 'src/app/models/user/user';
import { AuthService } from 'src/app/services/auth.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss', '../login/login.component.scss']
})
export class RegisterComponent implements OnInit, OnDestroy {
  private auth: Auth = inject(Auth);
  formGroup?: FormGroup;
  subs: Subscription[] = [];
  @Output() loginBtnClick: EventEmitter<void> = new EventEmitter<void>();

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private toastService: ToastService
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  get email(): string {
    return this.formGroup?.get('email')?.value;
  }

  get password(): string {
    return this.formGroup?.get('password')?.value;
  }

  get repeatPassword(): string {
    return this.formGroup?.get('repeatPassword')?.value;
  }

  get displayName(): string | null {
    return this.formGroup?.get('displayName')?.value;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
      displayName: [null]
    });
  }

  register(): void {
    const user: User = { email: this.email, password: this.password };
    if(this.displayName) {
      user.displayName = this.displayName;
    }
    this.subs.push(
      this.authService.register(user).pipe(
        switchMap(() => this.authService.login(user))
      ).subscribe({
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
          next: () => {
            this.authService.authenticate();
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

  checkIfPasswordsMatch(): boolean {
    return (this.password === this.repeatPassword) && (this.password !== '' || this.repeatPassword !== '');
  }

  loginBtnClicked(): void {
    this.loginBtnClick.emit();
  }
}

import { Component, OnDestroy, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { Subscription } from "rxjs";
import { PasswordResetService } from "src/app/services/password-reset.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
  formGroup?: FormGroup;
  subs: Subscription[] = [];
  resetSuccesfull = false;
  loading = false;

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private passwordResetService: PasswordResetService,
    private toastService: ToastService
  ) {}

  get password(): string {
    return this.formGroup?.get('password')?.value;
  }

  get repeatPassword(): string {
    return this.formGroup?.get('repeatPassword')?.value;
  }

  ngOnInit(): void {
    this.formGroup = this.formBuilder.group({
      password: ['', Validators.required],
      repeatPassword: ['', Validators.required],
    });
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleResetPasswordBtnClick(): void {
    const token = this.route?.snapshot?.params?.["token"];
    if(!token) {
      this.toastService.errorMessage('error.unexpectedError');
      return;
    }
    this.loading = true;
    this.subs.push(
      this.passwordResetService.resetPassword(token, this.password).subscribe({
        next: () => {
          this.resetSuccesfull = true;
          this.loading = false;
        },
        error: (error: any) => {
          this.toastService.handleError(error);
          this.loading = false;
        }
      })
    );
  }

  handleContinueBtnClick(): void {
    this.router.navigate(['/login']);
  }

  checkIfPasswordsMatch(): boolean {
    return (this.password === this.repeatPassword) && (this.password !== '' || this.repeatPassword !== '');
  }

}

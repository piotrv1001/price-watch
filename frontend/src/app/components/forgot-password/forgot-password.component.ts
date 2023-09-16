import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { PasswordResetService } from "src/app/services/password-reset.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnDestroy {
  email?: string;
  subs: Subscription[] = [];
  emailSent = false;
  loading = false;

  constructor(
    private passwordResetService: PasswordResetService,
    private toastService: ToastService
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleForgotPasswordBtnClick(): void {
    this.emailSent = true;
    // if (!this.email) {
    //   return;
    // }
    // this.loading = true;
    // this.subs.push(
    //   this.passwordResetService.forgotPassword(this.email).subscribe({
    //     next: () => {
    //       this.emailSent = true;
    //       this.loading = false;
    //     },
    //     error: (error: any) => {
    //       this.loading = false;
    //       if(error.status === 404) {
    //         this.toastService.errorMessage('error.invalidEmail');
    //       } else {
    //         this.toastService.handleError(error);
    //       }
    //     }
    //   })
    // );
  }
}

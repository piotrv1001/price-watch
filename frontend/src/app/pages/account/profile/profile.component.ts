import { Subscription } from 'rxjs';
import { Component, OnDestroy, OnInit } from "@angular/core";
import { UserService } from "src/app/services/user.service";
import { User } from 'src/app/models/user/user';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit, OnDestroy {
  initialEmail?: string;
  initialUsername?: string;
  email?: string;
  username?: string;
  profilePic?: string;
  bigLetter?: string;
  isGoogleAccount = false;
  subs: Subscription[] = [];
  loading = false;
  saving = false;
  isGuest = false;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getInitialData();
  }

  ngOnDestroy(): void {
    this.subs.forEach(sub => sub.unsubscribe());
  }

  changesMade(): boolean {
    return this.email !== this.initialEmail || this.username !== this.initialUsername;
  }

  isValidData(): boolean {
    return this.email !== undefined && this.username !== undefined && this.email !== '' && this.username !== '';
  }

  updateProfile(): void {
    if(this.email && this.username) {
      this.saving = true;
      this.subs.push(
        this.userService.updateProfile({ email: this.email, displayName: this.username }).subscribe({
          next: (user: User) => {
            this.saving = false;
            this.toastService.successMessage('msg.success', 'profile.updateSuccess');
            this.initialEmail = user.email;
            this.initialUsername = user.displayName;
            this.email = this.initialEmail;
            this.username = this.initialUsername;
          },
          error: (error: any) => {
            this.toastService.handleError(error);
          }
        })
      );
    }
  }

  private getInitialData(): void {
    this.loading = true;
    this.subs.push(
      this.userService.getProfile().subscribe({
        next: user => {
          this.isGuest = user.email === 'guest';
          this.isGoogleAccount = user.isGoogleAccount ?? false;
          this.initialEmail = user.email;
          this.initialUsername = user.displayName;
          this.profilePic = user.profilePic;
          this.email = this.initialEmail;
          this.username = this.initialUsername;
          if(user.displayName) {
            this.bigLetter = user.displayName.charAt(0).toUpperCase();
          } else {
            this.bigLetter = user.email?.charAt(0).toUpperCase();
          }
          this.loading = false;
        },
        error: (error: any) => {
          this.toastService.handleError(error);
        }
      })
    );
  }
}

import { Subscription, switchMap } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmailConfigService } from 'src/app/services/email-config.service';
import { DateUtil } from 'src/app/utils/date/date.util';
import { EmailConfig } from 'src/app/models/email-config/email-config';
import { CreateEmailConfigDTO } from 'src/app/models/dto/create-email-config.dto';
import { LabelAndValue } from 'src/app/types/common/label-and-value';
import { ToastService } from 'src/app/services/toast.service';
import { UserId, UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-email-config-page',
  templateUrl: './email-config-page.component.html',
  styleUrls: ['./email-config-page.component.scss'],
})
export class EmailConfigPageComponent implements OnInit, OnDestroy {
  weekDays: LabelAndValue[] = DateUtil.WEEK_DAYS.map((day, index) => ({label: day, value: index}));
  initialConfig?: CreateEmailConfigDTO;
  emptyInitialConfig = false;
  email = '';
  dayOfWeek?: LabelAndValue;
  hour = 0;
  minute = 0;
  enabled = false;
  subs: Subscription[] = [];
  loading = false;

  constructor(
    private emailConfigService: EmailConfigService,
    private toastService: ToastService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.getEmailConfig();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub) => sub.unsubscribe());
  }

  handleHourChange(event: number): void {
    this.hour = event;
  }

  handleMinuteChange(event: number): void {
    this.minute = event;
  }

  saveChanges(): void {
    const config: CreateEmailConfigDTO = {
      email: this.email,
      dayOfWeek: this.dayOfWeek?.value,
      hour: this.hour,
      minute: this.minute,
      enabled: this.enabled,
    };
    if(this.emptyInitialConfig) {
      this.createEmailConfig(config);
    } else {
      this.updateEmailConfig(config);
    }
  }

  changesMade(): boolean {
    if(!this.enabled && !this.initialConfig?.enabled && this.email === this.initialConfig?.email) {
      return false;
    }
    return (
      this.email !== this.initialConfig?.email ||
      this.dayOfWeek !== this.initialConfig?.dayOfWeek ||
      this.hour !== this.initialConfig?.hour ||
      this.minute !== this.initialConfig?.minute ||
      this.enabled !== this.initialConfig?.enabled
    );
  }

  private getEmailConfig(): void {
    this.loading = true;
    this.subs.push(
      this.emailConfigService.getByUserId().subscribe({
        next: (res: EmailConfig | null) => {
          this.loading = false;
          if (res) {
            this.initialConfig = res;
            this.emptyInitialConfig = false;
            this.email = res.email ?? '';
            if(this.dayOfWeek) {
              this.dayOfWeek.value = res.dayOfWeek ?? 0;
            }
            this.hour = res.hour ?? 0;
            this.minute = res.minute ?? 0;
            if(typeof res.enabled === 'number') {
              this.enabled = res.enabled === 1;
            } else {
              this.enabled = res.enabled ?? false;
            }
            this.initialConfig.enabled = this.enabled;
          } else {
            this.emptyInitialConfig = true;
            this.initialConfig = {
              email: '',
              dayOfWeek: 0,
              hour: 0,
              minute: 0,
              enabled: false
            };
          }
        },
        error: (error: any) => {
          this.loading = false;
          this.toastService.handleError(error);
        }
      })
    );
  }

  private createEmailConfig(config: CreateEmailConfigDTO): void {
    this.subs.push(
      this.emailConfigService.create(config).subscribe({
        next: (emailConfig: EmailConfig) => {
          this.initialConfig = emailConfig;
          if(typeof emailConfig.enabled === 'number') {
            this.initialConfig.enabled = emailConfig.enabled === 1;
          } else {
            this.initialConfig.enabled = emailConfig.enabled ?? false;
          }
          this.emptyInitialConfig = false;
          this.toastService.successMessage('Success!', 'Email config created successfully');
        },
        error: (error) => {
          this.toastService.handleError(error);
        }
      })
    );
    this.rescheduleEmail(config);
  }

  private updateEmailConfig(config: CreateEmailConfigDTO): void {
    this.subs.push(
      this.emailConfigService.update(config).subscribe({
        next: () => {
          this.initialConfig = {
            email: this.email,
            dayOfWeek: this.dayOfWeek?.value,
            hour: this.hour,
            minute: this.minute,
            enabled: this.enabled,
          };
          this.toastService.successMessage('Success!', 'Email config updated successfully');
        },
        error: (error) => {
          this.toastService.handleError(error);
        }
      })
    );
    this.rescheduleEmail(config);
  }

  private rescheduleEmail(config: CreateEmailConfigDTO): void {
    const reqConfig = {...config, enabled: config.enabled ? 1 : 0};
    this.subs.push(
      this.userService.getId().pipe(
        switchMap((userId: UserId) => this.emailConfigService.rescheduleEmail({...reqConfig, userId: userId.id})
      )).subscribe()
    );
  }
}

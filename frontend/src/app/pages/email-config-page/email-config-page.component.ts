import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { EmailConfigService } from 'src/app/services/email-config.service';
import { DateUtil } from 'src/app/utils/date/date.util';
import { EmailConfig } from 'src/app/models/email-config/email-config';
import { CreateEmailConfigDTO } from 'src/app/models/dto/create-email-config.dto';
import { LabelAndValue } from 'src/app/types/common/label-and-value';
import { ToastService } from 'src/app/services/toast.service';

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
  dayOfWeek = 0;
  hour = 0;
  minute = 0;
  enabled = false;
  subs: Subscription[] = [];

  constructor(
    private emailConfigService: EmailConfigService,
    private toastService: ToastService
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
      dayOfWeek: this.dayOfWeek,
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
    if(this.enabled === this.initialConfig?.enabled && this.email === this.initialConfig?.email) {
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
    this.subs.push(
      this.emailConfigService
        .getByUserId().subscribe((res: EmailConfig | null) => {
          if (res) {
            this.initialConfig = res;
            this.emptyInitialConfig = false;
            this.email = res.email ?? '';
            this.dayOfWeek = res.dayOfWeek ?? 0;
            this.hour = res.hour ?? 0;
            this.minute = res.minute ?? 0;
            this.enabled = res.enabled ?? false;
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
        })
    );
  }

  private createEmailConfig(config: CreateEmailConfigDTO): void {
    this.subs.push(
      this.emailConfigService.create(config).subscribe({
        next: (emailConfig: EmailConfig) => {
          this.initialConfig = emailConfig;
          this.emptyInitialConfig = false;
          this.toastService.successMessage('Success!', 'Email config created successfully');
        },
        error: (error) => {
          this.toastService.handleError(error);
        }
      })
    );
  }

  private updateEmailConfig(config: CreateEmailConfigDTO): void {
    this.subs.push(
      this.emailConfigService.update(config).subscribe({
        next: () => {
          this.toastService.successMessage('Success!', 'Email config updated successfully');
        },
        error: (error) => {
          this.toastService.handleError(error);
        }
      })
    );
  }
}

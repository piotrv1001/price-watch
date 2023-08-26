import { Component } from '@angular/core';
import { DateUtil } from 'src/app/utils/date/date.util';

interface EmailConfig {
  dayOfWeek: string;
  enabled: boolean;
  time: { hours: number; minutes: number };
}

@Component({
  selector: 'app-email-config-page',
  templateUrl: './email-config-page.component.html',
  styleUrls: ['./email-config-page.component.scss'],
})
export class EmailConfigPageComponent {
  weekDays: string[] = DateUtil.WEEK_DAYS;
  newProductReportConfig: EmailConfig = {
    dayOfWeek: 'Monday',
    enabled: true,
    time: { hours: 0, minutes: 0 },
  };
  priceChangeReportConfig: EmailConfig = {
    dayOfWeek: 'Monday',
    enabled: true,
    time: { hours: 0, minutes: 0 },
  };
  email: string = '';

  changesMade(): boolean {
    return false;
  }
}

import { Subscription } from 'rxjs';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { DateRangeDropdownOption } from "src/app/types/price-chart/price-chart";
import { DateRangeType } from "src/app/utils/date/date-range/date-range";

@Component({
  selector: 'app-date-range-with-options',
  templateUrl: './date-range-with-options.component.html',
  styleUrls: ['./date-range-with-options.component.scss']
})
export class DateRangeWithOptionsComponent implements OnInit, OnDestroy {
  @Input() startDate?: Date;
  @Input() endDate?: Date;
  @Input() disabled = false;
  @Output() startDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() endDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() dateRangeDropdownOptionChange: EventEmitter<DateRangeType> = new EventEmitter<DateRangeType>();
  selectedDropdownOption: DateRangeType | null = null;
  dateRangeDropdownOptions: DateRangeDropdownOption[] = [];
  subs: Subscription[] = [];

  constructor(private translateService: TranslateService) {}

  ngOnInit(): void {
    this.initDropdownOptions();
    this.getLangChange();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  getLangChange(): void {
    this.subs.push(
      this.translateService.onLangChange.subscribe(() => {
        this.initDropdownOptions();
      })
    );
  }

  handleStartDateChange(date: Date): void {
    this.startDate = date;
    this.startDateChange.emit(date);
  }

  handleEndDateChange(date: Date): void {
    this.endDate = date;
    this.endDateChange.emit(date);
  }

  handleDropdownChange(): void {
    if(this.selectedDropdownOption) {
      this.dateRangeDropdownOptionChange.emit(this.selectedDropdownOption);
    }
  }

  private initDropdownOptions(): void {
    this.dateRangeDropdownOptions = [
      { label: this.translateService.instant('date.lastWeek'), value: 'last-week' },
      { label: this.translateService.instant('date.lastTwoWeeks'), value: 'last-two-weeks' },
      { label: this.translateService.instant('date.lastMonth'), value: 'last-month' },
    ];
    this.selectedDropdownOption = this.dateRangeDropdownOptions[0].value;
  }
}

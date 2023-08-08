import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { DateRangeDropdownOption } from "src/app/types/price-chart/price-chart";
import { DateRangeType } from "src/app/utils/date/date-range/date-range";

@Component({
  selector: 'app-date-range-with-options',
  templateUrl: './date-range-with-options.component.html',
  styleUrls: ['./date-range-with-options.component.scss']
})
export class DateRangeWithOptionsComponent implements OnInit {
  @Input() startDate?: Date;
  @Input() endDate?: Date;
  dateRangeDropdownOptions: DateRangeDropdownOption[] = [];
  selectedDropdownOption: DateRangeType | null = null;
  @Output() startDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() endDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() dateRangeDropdownOptionChange: EventEmitter<DateRangeType> = new EventEmitter<DateRangeType>();

  ngOnInit(): void {
    this.initDropdownOptions();
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
      { label: 'Last week', value: 'last-week' },
      { label: 'Last month', value: 'last-month' },
      { label: 'Last year',  value: 'last-year' }
    ];
    this.selectedDropdownOption = this.dateRangeDropdownOptions[0].value;
  }
}

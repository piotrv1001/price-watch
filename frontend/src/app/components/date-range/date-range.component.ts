import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-date-range',
  templateUrl: './date-range.component.html',
  styleUrls: ['./date-range.component.scss']
})
export class DateRangeComponent {
  @Input() startDate?: Date;
  @Input() endDate?: Date;
  @Output() startDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  @Output() endDateChange: EventEmitter<Date> = new EventEmitter<Date>();
  dateFormat = 'd MM yy';

  handleStartDateChange(startDate: Date): void {
    this.startDateChange.emit(startDate);
  }

  handleEndDateChange(endDate: Date): void {
    this.endDateChange.emit(endDate);
  }
}
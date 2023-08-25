import { Component, EventEmitter, Input, Output } from "@angular/core";

@Component({
  selector: 'app-hours-minutes',
  templateUrl: './hours-minutes.component.html',
  styleUrls: ['./hours-minutes.component.scss']
})
export class HoursMinutesComponent {
  @Input() hours: number = 0;
  @Input() minutes: number = 0;
  @Input() disabled: boolean = false;
  @Output() hoursChange: EventEmitter<number> = new EventEmitter<number>();
  @Output() minutesChange: EventEmitter<number> = new EventEmitter<number>();
  hoursIntervalId?: any;
  minutesIntervalId?: any;

  onHoursMouseDown(event: Event, increment: boolean): void {
    this.hoursIntervalId = setInterval(() => {
      this.changeHours(event, increment);
    }, 150);
  }

  onHoursMouseUp(event: Event): void {
    event.preventDefault();
    if(this.hoursIntervalId !== undefined) {
      clearInterval(this.hoursIntervalId);
    }
  }

  onMinutesMouseDown(event: Event, increment: boolean): void {
    this.minutesIntervalId = setInterval(() => {
      this.changeMinutes(event, increment);
    }, 150);
  }

  onMinutesMouseUp(event: Event): void {
    event.preventDefault();
    if(this.minutesIntervalId !== undefined) {
      clearInterval(this.minutesIntervalId);
    }
  }

  changeHours(event: Event, increment: boolean): void {
    event.preventDefault();
    this.hours += increment ? 1 : -1;
    if(this.hours < 0) {
      this.hours = 23;
    }
    this.hours = this.hours % 24;
    this.hoursChange.emit(this.hours);
  }

  changeMinutes(event: Event, increment: boolean): void {
    event.preventDefault();
    this.minutes += increment ? 1 : -1;
    if(this.minutes < 0) {
      this.minutes = 59;
    }
    this.minutes = this.minutes % 60;
    this.minutesChange.emit(this.minutes);
  }

}

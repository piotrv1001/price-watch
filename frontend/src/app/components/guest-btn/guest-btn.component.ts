import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-guest-btn',
  templateUrl: './guest-btn.component.html',
  styleUrls: ['./guest-btn.component.scss'],
})
export class GuestBtnComponent {
  @Output() guestBtnClick: EventEmitter<void> = new EventEmitter<void>();

  handleBtnClick(): void {
    this.guestBtnClick.emit();
  }
}

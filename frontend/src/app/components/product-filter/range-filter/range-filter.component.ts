import { Component, EventEmitter, Input, Output } from "@angular/core";

export interface Range {
  min?: number;
  max?: number;
}

@Component({
  selector: 'app-range-filter',
  templateUrl: './range-filter.component.html',
  styleUrls: ['./range-filter.component.scss']
})
export class RangeFilterComponent {
  @Input() minThreshold = 0;
  @Input() maxThreshold = 10000000;
  @Input() step = 10;
  @Input() label?: string;
  @Output() rangeChange: EventEmitter<Range> = new EventEmitter<Range>();
  min?: number;
  max?: number;

  handleRangeChange(): void {
    this.rangeChange.emit({ min: this.min, max: this.max });
  }
}

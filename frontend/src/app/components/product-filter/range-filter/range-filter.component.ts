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
  @Input() range: Range = {};
  @Output() rangeChange: EventEmitter<Range> = new EventEmitter<Range>();

  handleRangeChange(): void {
    this.rangeChange.emit({ min: this.range?.min, max: this.range?.max });
  }
}

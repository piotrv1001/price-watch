import { Component, Input } from "@angular/core";

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
  min?: number;
  max?: number;
}

import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-no-data-placeholder',
  templateUrl: './no-data-placeholder.component.html',
  styleUrls: ['./no-data-placeholder.component.scss']
})
export class NoDataPlaceholderComponent {
  @Input() size: 'small' | 'big' = 'small';
}

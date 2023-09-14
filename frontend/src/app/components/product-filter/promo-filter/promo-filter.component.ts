import { Component, EventEmitter, Input, Output } from "@angular/core";

export type Promo = 'all' | 'promo' | 'non-promo';

export interface PromoItem {
  value: Promo;
  label: string;
}

@Component({
  selector: 'app-promo-filter',
  templateUrl: './promo-filter.component.html',
  styleUrls: ['./promo-filter.component.scss']
})
export class PromoFilterComponent {
  @Input() promoItems: PromoItem[] = [];
  @Input() selectedPromo?: Promo;
  @Output() selectedPromoChange: EventEmitter<Promo> = new EventEmitter<Promo>();

  handleSelectedPromoChange(): void {
    this.selectedPromoChange.emit(this.selectedPromo ?? 'all');
  }
}

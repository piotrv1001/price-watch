import { Component, EventEmitter, OnInit, Output } from "@angular/core";

export type Promo = 'all' | 'promo' | 'non-promo';

interface PromoItem {
  value: Promo;
  label: string;
}

@Component({
  selector: 'app-promo-filter',
  templateUrl: './promo-filter.component.html',
  styleUrls: ['./promo-filter.component.scss']
})
export class PromoFilterComponent implements OnInit {
  promoItems: PromoItem[] = [];
  selectedPromo?: Promo;
  @Output() selectedPromoChange: EventEmitter<Promo> = new EventEmitter<Promo>();

  ngOnInit(): void {
    this.getPromoItems();
  }

  handleSelectedPromoChange(): void {
    this.selectedPromoChange.emit(this.selectedPromo ?? 'all');
  }

  private getPromoItems(): void {
    this.promoItems = [
      { value: 'all', label: 'filter.promo.all' },
      { value: 'promo', label: 'filter.promo.promo' },
      { value: 'non-promo', label: 'filter.promo.nonPromo' }
    ];
    this.selectedPromo = this.promoItems[0].value;
  }
}

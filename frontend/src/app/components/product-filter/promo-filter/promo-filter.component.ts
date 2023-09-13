import { Component, OnInit } from "@angular/core";

type Promo = 'all' | 'promo' | 'non-promo';

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

  ngOnInit(): void {
    this.getPromoItems();
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

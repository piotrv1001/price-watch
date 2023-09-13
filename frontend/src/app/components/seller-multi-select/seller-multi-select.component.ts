import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { MultiSelectChangeEvent } from 'primeng/multiselect';
import { Seller } from 'src/app/models/seller/seller';

@Component({
  selector: 'app-seller-multi-select',
  templateUrl: './seller-multi-select.component.html',
  styleUrls: ['./seller-multi-select.component.scss'],
})
export class SellerMultiSelectComponent implements OnInit {
  sellers: Seller[] = [];
  selectedSellers: Seller[] = [];
  @Output() selectedSellersChange: EventEmitter<Seller[]> = new EventEmitter<Seller[]>();

  ngOnInit(): void {
    this.getSellers();
  }

  handleSellersChange(event: MultiSelectChangeEvent): void {
    this.selectedSellersChange.emit(event.value);
  }

  private getSellers(): void {
    this.sellers = [
      { id: 1, name: 'SmartLED' },
      { id: 2, name: 'LEDLUX' },
      { id: 3, name: 'ledhouse_pl' },
      { id: 4, name: 'LightLogic' },
      { id: 5, name: 'Dled_pl' },
      { id: 6, name: 'superled-poland' },
      { id: 7, name: 'ELE24' },
    ];
    this.selectedSellers = [...this.sellers];
    this.selectedSellersChange.emit(this.selectedSellers);
  }
}

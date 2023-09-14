import { Component, Output, EventEmitter, Input } from '@angular/core';
import { MultiSelectChangeEvent } from 'primeng/multiselect';
import { Seller } from 'src/app/models/seller/seller';

@Component({
  selector: 'app-seller-multi-select',
  templateUrl: './seller-multi-select.component.html',
  styleUrls: ['./seller-multi-select.component.scss'],
})
export class SellerMultiSelectComponent {
  @Input() sellers: Seller[] = [];
  @Input() selectedSellers: string[] = [];
  @Output() selectedSellersChange: EventEmitter<string[]> = new EventEmitter<string[]>();

  handleSellersChange(event: MultiSelectChangeEvent): void {
    this.selectedSellersChange.emit(event.value);
  }
}

import { Component, EventEmitter, Input, OnInit, Output } from "@angular/core";
import { Seller } from "src/app/models/seller/seller";
import { ChosenSellerService } from "src/app/services/chosen-seller.service";

@Component({
  selector: 'app-choose-seller',
  templateUrl: './choose-seller.component.html',
  styleUrls: ['./choose-seller.component.scss']
})
export class ChooseSellerComponent implements OnInit {
  @Input() showLabel = true;
  sellers: Seller[] = [];
  currentSeller: Seller | null = null;
  @Output() sellerChange = new EventEmitter<Seller>();

  constructor(private chosenSellerService: ChosenSellerService) {}

  ngOnInit(): void {
    this.initSellers();
  }

  handleSellerChange(): void {
    this.updateCurrentSeller();
  }

  private initSellers(): void {
    this.sellers = [
      { id: 1, name: 'SmartLED' },
      { id: 2, name: 'LEDLUX' },
      { id: 3, name: 'ELE24' },
      { id: 4, name: 'ledhouse_pl' },
    ];
    this.currentSeller = this.sellers[0];
    this.sellerChange.emit(this.currentSeller);
  }

  private updateCurrentSeller(): void {
    if(!this.currentSeller) {
      return;
    }
    this.sellerChange.emit(this.currentSeller);
    if (this.currentSeller?.name) {
      this.chosenSellerService.setCurrentSeller(this.currentSeller.name);
    }
  }
}

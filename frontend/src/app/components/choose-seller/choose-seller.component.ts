import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Seller } from 'src/app/models/seller/seller';
import { ChosenSellerService } from 'src/app/services/chosen-seller.service';

@Component({
  selector: 'app-choose-seller',
  templateUrl: './choose-seller.component.html',
  styleUrls: ['./choose-seller.component.scss'],
})
export class ChooseSellerComponent implements OnInit {
  @Input() showLabel = true;
  @Input() disabled = false;
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
      {
        id: 1,
        name: 'SmartLED',
        logoLightTheme: 'smart_led_logo_light_theme.png',
        logoDarkTheme: 'smart_led_logo_dark_theme.png',
      },
      {
        id: 2,
        name: 'LEDLUX',
        logoLightTheme: 'led_lux_logo_light_theme.png',
        logoDarkTheme: 'led_lux_logo_dark_theme.png',
      },
      { id: 3, name: 'ledhouse_pl' },
      { id: 4, name: 'LightLogic' },
      { id: 5, name: 'Dled_pl' },
      { id: 6, name: 'superled-poland' },
      { id: 7, name: 'ELE24' },
    ];
    this.currentSeller = this.sellers[0];
  }

  private updateCurrentSeller(): void {
    if (!this.currentSeller) {
      return;
    }
    this.sellerChange.emit(this.currentSeller);
    if (this.currentSeller?.name) {
      this.chosenSellerService.setCurrentSeller(this.currentSeller.name);
    }
  }
}

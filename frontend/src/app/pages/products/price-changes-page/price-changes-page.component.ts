import { Component } from "@angular/core";
import { Seller } from "src/app/models/seller/seller";

@Component({
  selector: 'app-price-changes-page',
  templateUrl: './price-changes-page.component.html',
  styleUrls: ['./price-changes-page.component.scss']
})
export class PriceChangesPageComponent {
  currentSeller: Seller | null = null;

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
  }
}

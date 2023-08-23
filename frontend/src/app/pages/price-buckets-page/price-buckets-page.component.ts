import { Component } from "@angular/core";
import { Seller } from "src/app/models/seller/seller";

@Component({
  selector: 'app-price-buckets-page',
  templateUrl: './price-buckets-page.component.html',
  styleUrls: ['./price-buckets-page.component.scss']
})
export class PriceBucketsPageComponent {
  currentSeller: Seller | null = null;

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
  }
}

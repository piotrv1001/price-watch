import { Component } from "@angular/core";
import { Seller } from "src/app/models/seller/seller";

@Component({
  selector: "app-new-products-page",
  templateUrl: "./new-products-page.component.html",
  styleUrls: ["./new-products-page.component.scss"],
})
export class NewProductsPageComponent {
  currentSeller: Seller | null = null;

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
  }
}

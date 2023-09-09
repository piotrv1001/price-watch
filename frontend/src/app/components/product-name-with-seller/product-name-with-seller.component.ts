import { Component, Input } from "@angular/core";
import { Product } from "src/app/models/product/product";

@Component({
  selector: "app-product-name-with-seller",
  templateUrl: "./product-name-with-seller.component.html",
  styleUrls: ["./product-name-with-seller.component.scss"]
})
export class ProductNameWithSellerComponent {
  @Input() product?: Product;
}

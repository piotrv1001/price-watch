import { Component } from "@angular/core";

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent {
  newProductsOnly: boolean = false;
  priceChangeOnly: boolean = false;
}

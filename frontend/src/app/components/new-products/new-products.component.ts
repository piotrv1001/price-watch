import { Component, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { NewProductDTO } from "src/app/models/dto/new-product.dto";
import { PriceService } from "src/app/services/price.service";

@Component({
  selector: 'app-new-products',
  templateUrl: './new-products.component.html',
  styleUrls: ['./new-products.component.scss']
})
export class NewProductsComponent implements OnInit {

  subs: Subscription[] = [];
  products: NewProductDTO[] = [];

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.getNewProducts();
  }

  private getNewProducts(): void {
    const seller = 'SmartLED';
    this.subs.push(
      this.priceService.getNewProducts(seller).subscribe((products: NewProductDTO[]) => {
        this.products = products;
      })
    );
  }
}

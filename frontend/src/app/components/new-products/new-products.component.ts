import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { NewProductDTO } from "src/app/models/dto/new-product.dto";
import { ChosenSellerService } from "src/app/services/chosen-seller.service";
import { PriceService } from "src/app/services/price.service";

@Component({
  selector: 'app-new-products',
  templateUrl: './new-products.component.html',
  styleUrls: ['./new-products.component.scss']
})
export class NewProductsComponent implements OnInit, OnDestroy {
  products: NewProductDTO[] = [];
  currentSellerName = 'SmartLED';
  subs: Subscription[] = [];

  constructor(
    private priceService: PriceService,
    private chosenSellerService: ChosenSellerService
  ) {}

  ngOnInit(): void {
    this.getNewProducts();
    this.handleSellerChange();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleSellerChange(): void {
    this.subs.push(
      this.chosenSellerService.getCurrentSeller().subscribe((sellerName) => {
        this.currentSellerName = sellerName;
        this.getNewProducts();
      })
    );
  }

  private getNewProducts(): void {
    const today = new Date();
    const oneWeekAgo = new Date(today.getTime() - 8 * 24 * 60 * 60 * 1000);
    this.subs.push(
      this.priceService.getNewProducts(this.currentSellerName, oneWeekAgo.toISOString(), today.toISOString()).subscribe((products: NewProductDTO[]) => {
        this.products = products;
      })
    );
  }
}

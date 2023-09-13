import { Component, OnDestroy } from "@angular/core";
import { Subscription } from "rxjs";
import { ProductService } from "src/app/services/product.service";
import { Promo } from "./promo-filter/promo-filter.component";
import { Seller } from "src/app/models/seller/seller";
import { Range } from "./range-filter/range-filter.component";
import { ProductFilterDTO } from "src/app/models/dto/product-filter.dto";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnDestroy {
  sellers: string[] = [];
  statusList: number[] = [];
  minPrice: number = 0;
  maxPrice: number = 10000000;
  minBuyers: number = 0;
  maxBuyers: number = 10000000;
  promo: Promo = 'all';
  newProductsOnly: boolean = false;
  priceChangesOnly: boolean = false;
  subs: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) { }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleFilterApplyBtnClick(): void {
    this.getFilteredProducts();
  }

  handleSellersChange(sellers: Seller[]): void {
    this.sellers = sellers.map((seller: Seller) => seller.name ?? '');
  }

  handleStatusesChange(statuses: number[]): void {
    this.statusList = statuses;
  }

  handlePriceRangeChange(range: Range): void {
    this.minPrice = range.min;
    this.maxPrice = range.max;
  }

  handleBuyersRangeChange(range: Range): void {
    this.minBuyers = range.min;
    this.maxBuyers = range.max;
  }

  handleSelectedPromoChange(promo: Promo): void {
    this.promo = promo;
  }

  private getFilteredProducts(): void {
    const productFilter: ProductFilterDTO = {
      sellers: this.sellers,
      statusList: this.statusList,
      minPrice: this.minPrice,
      maxPrice: this.maxPrice,
      minBuyers: this.minBuyers,
      maxBuyers: this.maxBuyers,
      promo: this.promo,
      priceChangesOnly: this.priceChangesOnly
    };
    console.log('productFilter', productFilter);
    this.subs.push(
      this.productService.getFilteredProducts(productFilter).subscribe({
        next: (products) => {
          console.log('products', products);
        },
        error: (error: any) => {
          this.toastService.handleError(error);
        }
      })
    );
  }
}

import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { NewProductDTO } from "src/app/models/dto/new-product.dto";
import { Seller } from "src/app/models/seller/seller";
import { ProductService } from "src/app/services/product.service";
import { ToastService } from "src/app/services/toast.service";
import { LabelAndValue } from "src/app/types/common/label-and-value";

@Component({
  selector: "app-best-selling-products-page",
  templateUrl: "./top-products-page.component.html",
  styleUrls: ["./top-products-page.component.scss"],
})
export class TopProductsPageComponent implements OnInit, OnDestroy {
  products: NewProductDTO[] = [];
  currentSeller: Seller | null = null;
  loading = false;
  limitOptions: LabelAndValue[] = [];
  currentLimit: number | null = null;
  subs: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.currentSeller = { id: 1, name: 'SmartLED' };
    this.getLimitOptions();
    this.getTopProducts();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
    this.getTopProducts();
  }

  handleLimitChange(): void {
    this.getTopProducts();
  }

  private getTopProducts(): void {
    const seller = this.currentSeller?.name;
    const limit = this.currentLimit;
    if(!seller || !limit) {
      return;
    }
    this.loading = true;
    this.subs.push(
      this.productService.getTopProducts(seller, limit).subscribe({
        next: (products: NewProductDTO[]) => {
          this.loading = false;
          this.products = products;
        },
        error: (error: any) => {
          this.loading = false;
          this.toastService.handleError(error);
        }
      })
    );
  }

  private getLimitOptions(): void {
    this.limitOptions = [
      { label: 'Top 10', value: 10 },
      { label: 'Top 25', value: 20 },
      { label: 'Top 50', value: 50 },
    ];
    this.currentLimit = this.limitOptions[0].value;
  }
}

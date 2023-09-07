import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { DropdownChangeEvent } from "primeng/dropdown";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product/product";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: 'app-product-single-select',
  templateUrl: './product-single-select.component.html',
  styleUrls: ['./product-single-select.component.scss']
})
export class ProductSingleSelectComponent implements OnInit, OnDestroy {
  @Input() showLabel = true;
  @Output() selectedProductChange = new EventEmitter<Product>();
  products: Product[] = [];
  selectedProduct?: Product;
  subs: Subscription[] = [];
  loading = false;

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleProductChange(event: DropdownChangeEvent): void {
    this.selectedProductChange.emit(event.value);
  }

  private getAllProducts(): void {
    this.loading = true;
    this.subs.push(
      this.productService.getAllProducts().subscribe({
        next: (products: Product[]) => {
          this.loading = false;
          this.products = products;
        },
        error: () => {
          this.loading = false;
        }
      })
    );
  }
}

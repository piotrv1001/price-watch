import { PriceChartService } from './../../services/price-chart.service';
import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from "@angular/core";
import { MultiSelectChangeEvent } from "primeng/multiselect";
import { Subscription } from "rxjs";
import { Product } from "src/app/models/product/product";
import { ProductService } from "src/app/services/product.service";

@Component({
  selector: 'app-product-multiselect',
  templateUrl: './product-multi-select.component.html',
  styleUrls: ['./product-multi-select.component.scss']
})
export class ProductMultiSelectComponent implements OnInit, OnDestroy {
  @Input() showLabel = true;
  @Output() selectedProductsChange = new EventEmitter<Product[]>();
  products: Product[] = [];
  selectedProducts: Product[] = [];
  subs: Subscription[] = [];

  constructor(
    private productService: ProductService,
    private priceChartService: PriceChartService
  ) {}

  ngOnInit(): void {
    this.getAllProducts();
    this.subs.push(
      this.priceChartService.getProductRemovedIndex().subscribe((index: number) => {
        this.selectedProducts.splice(index, 1);
        this.selectedProducts = [...this.selectedProducts];
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleProductChange(event: MultiSelectChangeEvent): void {
    this.selectedProductsChange.emit(event.value);
  }

  private getAllProducts(): void {
    this.subs.push(
      this.productService.getAllProducts().subscribe((products: Product[]) => {
        this.products = products;
      })
    );
  }
}

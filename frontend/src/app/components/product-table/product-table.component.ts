import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { ProductWithPrice } from 'src/app/models/product/product-with-price';
import { ProductService } from 'src/app/services/product.service';
import { TableColumn } from 'src/app/types/table/column';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit, OnDestroy {

  @Input() products: ProductWithPrice[] = [];
  columns: TableColumn[] = [];
  subs: Subscription[] = [];

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.columns = this.getColumns();
    this.getProducts();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  navigateToUrl(url: string): void {
    window.open(url, '_blank');
  }

  private getProducts(): void {
    const seller = 'SmartLED';
    this.subs.push(
      this.productService.getBySeller(seller).subscribe((products: ProductWithPrice[]) => {
        this.products = products.slice(0, 8);
      })
    );
  }

  private getColumns(): TableColumn[] {
    return [
      { header: 'Name', field: 'name' },
      { header: 'Image', field: 'imgSrc' },
      { header: 'Price', field: 'currentPrice' },
      { header: 'Link', field: 'link' }
    ];
  }
}

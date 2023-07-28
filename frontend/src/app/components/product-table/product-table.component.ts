import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Price } from 'src/app/models/price/price';
import { Product } from 'src/app/models/product/product';
import { TableProduct } from 'src/app/models/product/table-product';
import { ProductService } from 'src/app/services/product.service';
import { TableColumn } from 'src/app/types/table/column';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit, OnDestroy {

  @Input() products: TableProduct[] = [];
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

  private getProducts(): void {
    const seller = 'SmartLED';
    this.subs.push(
      this.productService.getBySeller(seller).subscribe((products: Product[]) => {
        this.products = products.map(product => ({...product, currentPrice: this.getCurrentPrice(product.prices) })).slice(0, 8);
      })
    );
  }

  private getColumns(): TableColumn[] {
    return [
      { header: 'Name', field: 'name' },
      { header: 'Image', field: 'imgSrc' },
      { header: 'Price', field: 'currentPrice' },
      { header: 'Seller', field: 'seller' }
    ];
  }

  private getCurrentPrice(prices: Price[] | undefined): number | undefined {
    if(!prices) {
      return undefined;
    }
    const pricesSortedByDate = prices.sort((a, b) => {
      const aDate = this.getDate(a.date);
      const bDate = this.getDate(b.date);
      if(aDate && bDate) {
        return bDate.getTime() - aDate.getTime();
      }
      return 0;
    });
    return pricesSortedByDate[0].price;
  }

  private getDate(date: string | Date | undefined): Date | null {
    if(typeof date === 'string') {
      return new Date(date);
    } else if(date instanceof Date) {
      return date;
    }
    return null;
  }
}

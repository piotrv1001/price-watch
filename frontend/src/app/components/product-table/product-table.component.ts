import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Product } from 'src/app/models/product/product';
import { TableColumn } from 'src/app/types/table/column';
import { ProductTableType } from 'src/app/types/table/product-table-type';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit {

  @Input() products: Product[] = [];
  @Input() type: ProductTableType = 'new-products';
  @Input() showPaginator = true;
  @Input() paginatorRows = 10;
  columns: TableColumn[] = [];

  ngOnInit(): void {
    this.columns = this.getColumns();
  }

  navigateToUrl(url: string): void {
    window.open(url, '_blank');
  }

  private getColumns(): TableColumn[] {
    let columns: TableColumn[] = [];
    switch(this.type) {
      case 'new-products':
        columns = [
          { header: 'Name', field: 'name', ngStyle: { width: '60%' } },
          { header: 'Image', field: 'imgSrc', ngStyle: { width: '15%' } },
          { header: 'Price', field: 'currentPrice', ngStyle: { width: '15%' } },
          { header: 'Link', field: 'link', ngStyle: { width: '10%' } }
        ];
        break;
      case 'price-changes':
        columns = [
          { header: 'Name', field: 'name' },
          { header: 'Image', field: 'imgSrc' },
          { header: 'Old price', field: 'prevPrice' },
          { header: 'Current price', field: 'currentPrice' },
          { header: '+/-', field: 'priceChange' },
          { header: '+/- [%]', field: 'priceChangePercentage' },
          { header: 'Link', field: 'link' },
        ];
        break;
    }
    return columns;
  }
}

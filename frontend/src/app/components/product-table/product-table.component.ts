import { Component, Input, OnInit } from '@angular/core';
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
  downloadProgress = -1;

  ngOnInit(): void {
    this.columns = this.getColumns();
  }

  navigateToUrl(url: string): void {
    window.open(url, '_blank');
  }

  handleDownloadProgressChange(progress: number): void {
    this.downloadProgress = progress;
    if(progress === 100) {
      setTimeout(() => this.downloadProgress = -1, 2000);
    }
  }

  getFilterFields(): string[] {
    return this.columns.filter(column => column.filter).map(column => column.field);
  }

  private getColumns(): TableColumn[] {
    let columns: TableColumn[] = [];
    switch(this.type) {
      case 'new-products':
        columns = [
          { header: 'Name', field: 'name', ngStyle: { width: '60%' }, filter: true },
          { header: 'Image', field: 'imgSrc', ngStyle: { width: '15%' }, filter: false },
          { header: 'Price', field: 'currentPrice', ngStyle: { width: '15%' }, filter: false },
          { header: 'Link', field: 'link', ngStyle: { width: '10%' }, filter: false }
        ];
        break;
      case 'price-changes':
        columns = [
          { header: 'Name', field: 'name', ngStyle: { width: '35%' }, filter: true },
          { header: 'Image', field: 'imgSrc', ngStyle: { width: '15%' }, filter: false },
          { header: 'Old price', field: 'prevPrice', ngStyle: { width: '15%' }, filter: false },
          { header: 'Current price', field: 'currentPrice', ngStyle: { width: '15%' }, filter: false },
          { header: '+/- [%]', field: 'priceChangePercentage', ngStyle: { width: '15%' }, filter: false },
          { header: 'Link', field: 'link', ngStyle: { width: '5%' }, filter: false }
        ];
        break;
    }
    return columns;
  }
}

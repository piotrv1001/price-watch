import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { CustomTemplate } from 'src/app/models/dto/column.dto';
import { ExportDataDTO } from 'src/app/models/dto/export-data.dto';
import { Product } from 'src/app/models/product/product';
import { TableColumn } from 'src/app/types/table/column';
import { ProductTableType } from 'src/app/types/table/product-table-type';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss']
})
export class ProductTableComponent implements OnInit, OnChanges {

  @Input() products: Product[] = [];
  @Input() type: ProductTableType = 'new-products';
  @Input() showPaginator = true;
  @Input() paginatorRows = 10;
  columns: TableColumn[] = [];
  exportData: ExportDataDTO | null = null;
  downloadProgress = -1;

  ngOnInit(): void {
    this.columns = this.getColumns();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['products'] && this.exportData) {
      this.exportData.data = this.products;
    }
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
          { header: 'Price', field: 'currentPrice', ngStyle: { width: '15%' }, filter: false, formatOptions: { suffix: ' zł' } },
          { header: 'Link', field: 'link', ngStyle: { width: '10%' }, filter: false }
        ];
        this.exportData = {
          title: 'New products',
          columns: [
            { header: '', key: 'imgSrc', isImage: true },
            { header: 'Name', key: 'name', width: 64 },
            { header: 'Price', key: 'currentPrice', width: 16 },
            { header: 'Link', key: 'link', width: 10, isLink: true }
          ],
          data: this.products
        };
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
        this.exportData = {
          title: 'Price changes',
          columns: [
            { header: '', key: 'imgSrc', isImage: true },
            { header: 'Name', key: 'name', width: 64 },
            { header: 'Old price', key: 'prevPrice', width: 16, formatOptions: { suffix: ' zł' } },
            { header: 'Current price', key: 'currentPrice', width: 16, formatOptions: { suffix: ' zł' } },
            { header: '+/- [%]', key: 'priceChangePercentage', width: 12, formatOptions: { suffix: ' %' }, customTemplate: CustomTemplate.PriceChange },
            { header: 'Link', key: 'link', width: 10, isLink: true }
          ],
          data: this.products
        };
        break;
    }
    return columns;
  }
}

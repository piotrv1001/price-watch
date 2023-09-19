import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { CustomTemplate } from 'src/app/models/dto/column.dto';
import { ExportDataDTO } from 'src/app/models/dto/export-data.dto';
import { Product } from 'src/app/models/product/product';
import { TableColumn } from 'src/app/types/table/column';
import { ProductTableType } from 'src/app/types/table/product-table-type';
import { DialogService } from 'primeng/dynamicdialog';
import { PriceChartDialogComponent } from '../price-chart-dialog/price-chart-dialog.component';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-product-table',
  templateUrl: './product-table.component.html',
  styleUrls: ['./product-table.component.scss'],
  providers: [DialogService]
})
export class ProductTableComponent implements OnInit, OnChanges, OnDestroy {

  @Input() products: Product[] = [];
  @Input() isFavoriteProductPage = false;
  @Input() type: ProductTableType = 'new-products';
  @Input() showPaginator = true;
  @Input() paginatorRows = 10;
  @Input() placeholderSize: 'small' | 'big' = 'small';
  @Input() showCaption = true;
  favoriteProductIds: string[] = [];
  columns: TableColumn[] = [];
  exportData: ExportDataDTO | null = null;
  downloadProgress = -1;
  productId2Favorite: Map<string, boolean> = new Map<string, boolean>();
  subs: Subscription[] = [];

  constructor(
    private translateService: TranslateService,
    private dialogService: DialogService,
    private userService: UserService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.getFavoriteProducts();
    this.columns = this.getColumns();
    this.subs.push(
      this.translateService.onLangChange.subscribe(() => {
        this.columns = this.getColumns();
      })
    );
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['products'] && this.exportData) {
      this.exportData.data = this.products;
    }
  }

  handleFavoriteBtnClick(product: Product): void {
    const productId = product?.id ?? product.productId;
    if(!productId) {
      return;
    }
    const isFavorite = this.isProductFavorite(product);
    if(isFavorite) {
      this.subs.push(
        this.userService.deleteFavoriteProduct(productId).subscribe({
          next: (products: Product[]) => {
            if(this.isFavoriteProductPage) {
              this.products = products;
            }
            this.favoriteProductIds = products.map((p: Product) => p.id ?? '');
            if(productId) {
              this.productId2Favorite.set(productId, false);
            }
          },
          error: (error: any) => {
            this.toastService.handleError(error);
          }
        })
      );
    } else {
      this.subs.push(
        this.userService.addNewFavoriteProduct(productId).subscribe({
          next: (products: Product[]) => {
            if(this.isFavoriteProductPage) {
              this.products = products;
            }
            this.favoriteProductIds = products.map((p: Product) => p.id ?? '');
            if(productId) {
              this.productId2Favorite.set(productId, true);
            }
          },
          error: (error: any) => {
            this.toastService.handleError(error);
          }
        })
      );
    }
  }

  isProductFavorite(product: Product): boolean {
    const productId = product?.id ?? product.productId;
    return productId !== undefined && this.productId2Favorite.get(productId) === true;
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

  handleChartBtnClick(product: Product): void {
    this.dialogService.open(PriceChartDialogComponent, {
      data: {
        productId: product?.id ?? product.productId
      },
      header: product.name,
      width: '80%'
    });
  }

  getFilterFields(): string[] {
    return this.columns.filter(column => column.filter).map(column => column.field);
  }

  private getFavoriteProducts(): void {
    if(this.isFavoriteProductPage) {
      this.favoriteProductIds = this.products.map((p: Product) => p.id ?? '');
      this.productId2Favorite.clear();
      this.favoriteProductIds.forEach(productId => this.productId2Favorite.set(productId, true));
      return;
    }
    this.subs.push(
      this.userService.getFavoriteProducts().subscribe({
        next: (products: Product[]) => {
          this.favoriteProductIds = products.map((p: Product) => p.id ?? '');
          this.productId2Favorite.clear();
          this.favoriteProductIds.forEach(productId => this.productId2Favorite.set(productId, true));
        },
        error: (error: any) => {
          this.toastService.handleError(error);
        }
      })
    );
  }

  private getColumns(): TableColumn[] {
    let columns: TableColumn[] = [];
    switch(this.type) {
      case 'new-products':
        columns = [
          { header: 'name', field: 'name', ngStyle: { width: '35%' }, filter: true },
          { header: 'image', field: 'imgSrc', ngStyle: { width: '10%' }, filter: false },
          { header: 'numberOfPeople', field: 'numberOfPeople', ngStyle: { width: '10%' }, filter: false },
          { header: 'price', field: 'currentPrice', ngStyle: { width: '10%' }, filter: false, formatOptions: { suffix: ' zł' } },
          { header: 'Promo', field: 'promo', ngStyle: { width: '10%' }, filter: false, translate: false },
          { header: 'chart', field: 'chart', ngStyle: { width: '10%' }, filter: false, ignoreNull: true },
          { header: 'Status', field: 'status', ngStyle: { width: '10%' }, filter: false, translate: false },
          { field: 'favorite', ngStyle: { width: '5%' }, filter: false, ignoreNull: true }
        ];
        this.exportData = {
          title: this.translateService.instant('menu.newProducts'),
          columns: [
            { header: '', key: 'imgSrc', isImage: true },
            { header: this.translateService.instant('productTable.name'), key: 'name', width: 64 },
            { header: this.translateService.instant('productTable.currentPrice'), key: 'currentPrice', width: 16 },
            { header: 'Link', key: 'link', width: 10, isLink: true },
            { header: 'Status', key: 'status', width: 16 }
          ],
          data: this.products.map(product => ({...product, status: this.getStatusTranslation(product.status)}))
        };
        break;
      case 'price-changes':
        columns = [
          { header: 'name', field: 'name', ngStyle: { width: '25%' }, filter: true },
          { header: 'image', field: 'imgSrc', ngStyle: { width: '10%' }, filter: false },
          { header: 'numberOfPeople', field: 'numberOfPeople', ngStyle: { width: '10%' }, filter: false },
          { header: 'oldPrice', field: 'prevPrice', ngStyle: { width: '10%' }, filter: false },
          { header: 'currentPrice', field: 'currentPrice', ngStyle: { width: '10%' }, filter: false },
          { header: '+/- [%]', field: 'priceChangePercentage', ngStyle: { width: '10%' }, filter: false, translate: false },
          { header: 'chart', field: 'chart', ngStyle: { width: '10%' }, filter: false, ignoreNull: true },
          { header: 'Status', field: 'status', ngStyle: { width: '10%' }, filter: false, translate: false },
          { field: 'favorite', ngStyle: { width: '5%' }, filter: false, ignoreNull: true }
        ];
        this.exportData = {
          title: this.translateService.instant('menu.priceChanges'),
          columns: [
            { header: '', key: 'imgSrc', isImage: true },
            { header: this.translateService.instant('productTable.name'), key: 'name', width: 64 },
            { header: this.translateService.instant('productTable.oldPrice'), key: 'prevPrice', width: 16, formatOptions: { suffix: ' zł' } },
            { header: this.translateService.instant('productTable.currentPrice'), key: 'currentPrice', width: 16, formatOptions: { suffix: ' zł' } },
            { header: '+/- [%]', key: 'priceChangePercentage', width: 12, formatOptions: { suffix: ' %' }, customTemplate: CustomTemplate.PriceChange },
            { header: 'Link', key: 'link', width: 10, isLink: true },
            { header: 'Status', key: 'status', width: 16 }
          ],
          data: this.products.map(product => ({...product, status: this.getStatusTranslation(product.status)}))
        };
        break;
      case 'new-products-min':
        columns = [
          { header: 'name', field: 'name', ngStyle: { width: '60%' }, filter: true },
          { header: 'image', field: 'imgSrc', ngStyle: { width: '20%' }, filter: false },
          { header: 'price', field: 'currentPrice', ngStyle: { width: '20%' }, filter: false, formatOptions: { suffix: ' zł' } },
        ];
        this.exportData = null;
        break;
      case 'price-changes-min':
        columns = [
          { header: 'name', field: 'name', ngStyle: { width: '40%' }, filter: true },
          { header: 'image', field: 'imgSrc', ngStyle: { width: '20%' }, filter: false },
          { header: 'oldPrice', field: 'prevPrice', ngStyle: { width: '20%' }, filter: false },
          { header: 'currentPrice', field: 'currentPrice', ngStyle: { width: '20%' }, filter: false },
        ];
        this.exportData = null;
        break;
    }
    return columns;
  }

  private getStatusTranslation(status?: number): string {
    if(status === undefined) {
      return this.translateService.instant('status.unknown');
    }
    switch(status) {
      case 0:
        return this.translateService.instant('status.available');
      case 1:
        return this.translateService.instant('status.unavailable');
      case 2:
        return this.translateService.instant('status.withdrawn');
      default:
        return this.translateService.instant('status.unknown');
    }
  }
}

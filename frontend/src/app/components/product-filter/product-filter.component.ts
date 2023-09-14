import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild } from "@angular/core";
import { Subscription } from "rxjs";
import { ProductService } from "src/app/services/product.service";
import { Promo, PromoItem } from "./promo-filter/promo-filter.component";
import { Seller } from "src/app/models/seller/seller";
import { Range } from "./range-filter/range-filter.component";
import { ProductFilterDTO } from "src/app/models/dto/product-filter.dto";
import { ToastService } from "src/app/services/toast.service";
import { ProductWithPrice } from "src/app/models/product/product-with-price";
import { StatusItem } from "./status-filter/status-filter.component";
import { ProductStatus } from "src/app/models/product/status";
import { FilterService } from "src/app/services/filter.service";
import { CreateFilterDTO } from "src/app/models/dto/create-filter.dto";
import { OverlayPanel } from "primeng/overlaypanel";
import { Filter } from "src/app/models/filter/filter";

@Component({
  selector: 'app-product-filter',
  templateUrl: './product-filter.component.html',
  styleUrls: ['./product-filter.component.scss']
})
export class ProductFilterComponent implements OnInit, OnDestroy {
  @ViewChild('op') op?: OverlayPanel;
  @Output() loadingChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() productsChange: EventEmitter<ProductWithPrice[]> = new EventEmitter<ProductWithPrice[]>();
  selectedFilter?: Filter;
  userFilters: Filter[] = [];
  sellers: Seller[] = [];
  selectedSellers: string[] = [];
  statusList: StatusItem[] = [];
  selectedStatuses: ProductStatus[] = [];
  promoItems: PromoItem[] = [];
  selectedPromo: Promo = 'all';
  selectedPriceRange: Range = {};
  selectedBuyerRange: Range = {};
  newProductsOnly: boolean = false;
  priceChangesOnly: boolean = false;
  filteredProducts: ProductWithPrice[] = [];
  loading = false;
  subs: Subscription[] = [];
  newFilterName = '';
  newFilterSaving = false;

  constructor(
    private productService: ProductService,
    private toastService: ToastService,
    private filterService: FilterService
  ) { }

  ngOnInit(): void {
    this.getSellers();
    this.getStatusList();
    this.getPromoItems();
    this.getUserFilters();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleFilterApplyBtnClick(): void {
    this.getFilteredProducts();
  }

  handleNewFilterBtnClick(): void {
    this.newFilterSaving = true;
    const createFilterDTO: CreateFilterDTO = {
      name: this.newFilterName,
      jsonFilter: JSON.stringify({
        sellers: this.selectedSellers,
        statusList: this.selectedStatuses,
        minPrice: this.selectedPriceRange.min,
        maxPrice: this.selectedPriceRange.max,
        minBuyers: this.selectedBuyerRange.min,
        maxBuyers: this.selectedBuyerRange.max,
        promo: this.selectedPromo,
        priceChangesOnly: this.priceChangesOnly,
        newProductsOnly: this.newProductsOnly
      })
    };
    this.subs.push(
      this.filterService.createFilter(createFilterDTO).subscribe({
        next: () => {
          this.toastService.successMessage('msg.success', 'filter.createSuccess');
          this.newFilterSaving = false;
          this.op?.hide();
        },
        error: (error: any) => {
          this.toastService.handleError(error);
          this.newFilterSaving = false;
          this.op?.hide();
        }
      })
    );
  }

  handleResetBtnClick(): void {
    this.getSellers();
    this.getStatusList();
    this.newProductsOnly = false;
    this.priceChangesOnly = false;
    this.selectedPromo = 'all';
    this.selectedPriceRange = {};
    this.selectedBuyerRange = {};
    this.selectedFilter = undefined;
  }

  handleDeleteFilterBtnClick(filter: Filter): void {
    if(!filter.id) {
      return;
    }
    this.subs.push(
      this.filterService.deleteFilter(filter.id).subscribe({
        next: () => {
          this.toastService.successMessage('msg.success', 'filter.deleteSuccess');
          this.userFilters = this.userFilters.filter((f: Filter) => f.id !== filter.id);
        },
        error: (error: any) => {
          this.toastService.handleError(error);
        }
      })
    );
  }

  loadUserFilter(): void {
    const jsonFilter = this.selectedFilter?.jsonFilter;
    if(jsonFilter) {
      try {
        const filter = JSON.parse(jsonFilter);
        this.selectedSellers = filter.sellers;
        this.selectedStatuses = filter.statusList;
        this.selectedPriceRange = {
          min: filter.minPrice,
          max: filter.maxPrice
        };
        this.selectedBuyerRange = {
          min: filter.minBuyers,
          max: filter.maxBuyers
        };
        this.selectedPromo = filter.promo;
        this.priceChangesOnly = filter.priceChangesOnly;
        this.newProductsOnly = filter.newProductsOnly;
      } catch(error) {
        this.toastService.handleError(error);
      }
    }
  }

  private getSellers(): void {
    this.sellers = [
      { id: 1, name: 'SmartLED' },
      { id: 2, name: 'LEDLUX' },
      { id: 3, name: 'ledhouse_pl' },
      { id: 4, name: 'LightLogic' },
      { id: 5, name: 'Dled_pl' },
      { id: 6, name: 'superled-poland' },
      { id: 7, name: 'ELE24' },
    ];
    this.selectedSellers = [...this.sellers.map((seller: Seller) => seller.name ?? '')];
  }

  private getStatusList(): void {
    this.statusList = [
      { label: 'status.available', value: ProductStatus.AVAILABLE },
      { label: 'status.unavailable', value: ProductStatus.TEMP_UNAVAILABLE },
      { label: 'status.withdrawn', value: ProductStatus.UNAVAILABLE }
    ];
    this.selectedStatuses = this.statusList.map((status) => status.value);
  }

  private getPromoItems(): void {
    this.promoItems = [
      { value: 'all', label: 'filter.promo.all' },
      { value: 'promo', label: 'filter.promo.promo' },
      { value: 'non-promo', label: 'filter.promo.nonPromo' }
    ];
    this.selectedPromo = this.promoItems[0].value;
  }

  private getUserFilters(): void {
    this.subs.push(
      this.filterService.getFilters().subscribe({
        next: (filters) => {
          this.userFilters = filters;
        },
        error: (error: any) => {
          this.toastService.handleError(error);
        }
      })
    );
  }

  private getFilteredProducts(): void {
    const productFilter: ProductFilterDTO = {
      sellers: this.selectedSellers,
      statusList: this.selectedStatuses,
      minPrice: this.selectedPriceRange.min,
      maxPrice: this.selectedPriceRange.max,
      minBuyers: this.selectedBuyerRange.min,
      maxBuyers: this.selectedBuyerRange.max,
      promo: this.selectedPromo,
      priceChangesOnly: this.priceChangesOnly,
      newProductsOnly: this.newProductsOnly
    };
    this.updateLoading(true);
    this.subs.push(
      this.productService.getFilteredProducts(productFilter).subscribe({
        next: (products) => {
          this.updateLoading(false);
          this.filteredProducts = products;
          this.productsChange.emit(products);
        },
        error: (error: any) => {
          this.updateLoading(false);
          this.toastService.handleError(error);
        }
      })
    );
  }

  private updateLoading(loading: boolean): void {
    this.loading = loading;
    this.loadingChange.emit(loading);
  }
}

import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, catchError, forkJoin, of, switchMap, tap } from 'rxjs';
import { NewProductDTO } from 'src/app/models/dto/new-product.dto';
import { PriceChangeDTO } from 'src/app/models/dto/price-change.dto';
import { SellerInfo } from 'src/app/models/dto/seller-info';
import { ProductEvent } from 'src/app/models/event/product-event';
import { Seller } from 'src/app/models/seller/seller';
import { PriceService } from 'src/app/services/price.service';
import { ProductService } from 'src/app/services/product.service';
import { ThemeService } from 'src/app/services/theme.service';
import { Theme } from 'src/app/types/common/theme';
import { Bucket } from 'src/app/types/histogram/bucket';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss']
})
export class SellersComponent implements OnInit, OnDestroy {
  currentSeller: Seller | null = null;
  priceChanges: PriceChangeDTO[] = [];
  newProducts: NewProductDTO[] = [];
  sellerInfo?: SellerInfo;
  subs: Subscription[] = [];
  events: ProductEvent[] = [];
  logo?: string;
  darkTheme = false;
  loading = false;
  currentPriceRangeTranslation: string = 'chart.buckets.unknown';
  startDate?: Date;
  endDate?: Date;
  topProductId?: string;

  constructor(
    private productService: ProductService,
    private themeService: ThemeService,
    private router: Router,
    private priceService: PriceService,
  ) { }

  ngOnInit(): void {
    this.startDate = new Date();
    this.startDate.setDate(this.startDate.getDate() - 6);
    this.endDate = new Date();
    this.currentSeller = {
      id: 1,
      name: 'SmartLED',
      logoLightTheme: 'smart_led_logo_light_theme.png',
      logoDarkTheme: 'smart_led_logo_dark_theme.png',
    };
    this.logo = this.currentSeller?.logoLightTheme;
    const themeStorage = localStorage.getItem('theme');
    const darkTheme = themeStorage === Theme.DARK;
    this.updateColors(darkTheme);
    this.getThemeChange();
    this.getData();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
    this.logo = this.darkTheme ? this.currentSeller?.logoDarkTheme : this.currentSeller?.logoLightTheme;
    this.getData();
  }

  getThemeChange(): void {
    this.subs.push(
      this.themeService.getTheme().subscribe((darkTheme) => {
        this.updateColors(darkTheme);
      })
    );
  }

  goToPriceBuckets(): void {
    this.router.navigate(['/products/price-buckets']);
  }

  goToNewProducts(): void {
    this.router.navigate(['/products/new-products']);
  }

  goToTimeline(): void {
    this.router.navigate(['/products/timeline']);
  }

  private updateColors(darkTheme: boolean): void {
    this.darkTheme = darkTheme;
    this.logo = this.darkTheme ? this.currentSeller?.logoDarkTheme : this.currentSeller?.logoLightTheme;
  }

  private getData(): void {
    const name = this.currentSeller?.name;
    if(!name) {
      return;
    }
    const newProducts$ = this.priceService.getNewProducts(name, undefined, undefined, 5);
    const sellerInfo$ = this.productService.getSellerInfo(name);
    const sources$ = forkJoin([
      newProducts$.pipe(catchError(() => of([]))),
      sellerInfo$.pipe(catchError(() => of(undefined)))
    ]);
    this.loading = true;
    this.subs.push(
      sources$.pipe(
        tap(([newProducts, sellerInfo]) => {
          this.newProducts = newProducts;
          this.sellerInfo = sellerInfo;
          this.updateCurrentPriceRangeTranslation();
        }),
        switchMap(() => {
          this.topProductId = this.sellerInfo?.bestSellingProducts?.[0]?.id;
          return this.topProductId === undefined ? of([]) : this.priceService.getProductEvents(this.topProductId);
        })
      ).subscribe((events: ProductEvent[]) => {
        this.loading = false;
        this.events = events;
      })
    );
    // this.subs.push(
    //   sources$.subscribe(([newProducts, sellerInfo]) => {
    //     this.loading = false;
    //     this.newProducts = newProducts;
    //     this.sellerInfo = sellerInfo;
    //     this.updateCurrentPriceRangeTranslation();
    //   })
    // );
  }

  private updateCurrentPriceRangeTranslation(): void {
    if(this.sellerInfo?.bucketInfo?.dominantBucket == null) {
      return;
    }
    switch(this.sellerInfo.bucketInfo.dominantBucket) {
      case Bucket.CHEAP:
        this.currentPriceRangeTranslation = 'chart.buckets.cheap';
        break;
      case 1:
        this.currentPriceRangeTranslation = 'chart.buckets.medium';
        break;
      case 2:
        this.currentPriceRangeTranslation = 'chart.buckets.expensive';
        break;
      case 3:
        this.currentPriceRangeTranslation = 'chart.buckets.veryExpensive';
        break;
    }
  }
}

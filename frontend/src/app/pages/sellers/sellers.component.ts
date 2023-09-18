import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { SellerInfo } from 'src/app/models/dto/seller-info';
import { Seller } from 'src/app/models/seller/seller';
import { ProductService } from 'src/app/services/product.service';
import { ThemeService } from 'src/app/services/theme.service';
import { ToastService } from 'src/app/services/toast.service';
import { Theme } from 'src/app/types/common/theme';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss']
})
export class SellersComponent implements OnInit, OnDestroy {
  currentSeller: Seller | null = null;
  sellerInfo?: SellerInfo;
  subs: Subscription[] = [];
  logo?: string;
  darkTheme = false;
  loading = false;

  constructor(
    private productService: ProductService,
    private toastService: ToastService,
    private themeService: ThemeService
  ) { }

  ngOnInit(): void {
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
    this.getSellerInfo();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
    this.logo = this.darkTheme ? this.currentSeller?.logoDarkTheme : this.currentSeller?.logoLightTheme;
    this.getSellerInfo();
  }

  getThemeChange(): void {
    this.subs.push(
      this.themeService.getTheme().subscribe((darkTheme) => {
        this.updateColors(darkTheme);
      })
    );
  }

  private updateColors(darkTheme: boolean): void {
    this.darkTheme = darkTheme;
    this.logo = this.darkTheme ? this.currentSeller?.logoDarkTheme : this.currentSeller?.logoLightTheme;
  }

  private getSellerInfo(): void {
    if(!this.currentSeller?.name) {
      return;
    }
    this.loading = true;
    this.subs.push(
      this.productService.getSellerInfo(this.currentSeller.name).subscribe({
        next: (sellerInfo: SellerInfo) => {
          this.loading = false;
          this.sellerInfo = sellerInfo;
        },
        error: (error: any) => {
          this.loading = false;
          this.toastService.handleError(error);
        }
      })
    );
  }
}

import { Subscription } from 'rxjs';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Product } from 'src/app/models/product/product';
import { UserService } from 'src/app/services/user.service';
import { ToastService } from 'src/app/services/toast.service';

@Component({
  selector: 'app-favorite-products-page',
  templateUrl: './favorite-products-page.component.html',
  styleUrls: ['./favorite-products-page.component.scss']
})
export class FavoriteProductsPageComponent implements OnInit, OnDestroy {
  favoriteProducts: Product[] = [];
  subs: Subscription[] = [];
  loading = false;

  constructor(
    private userService: UserService,
    private toastService: ToastService
  ) { }

  ngOnInit(): void {
    this.getFavoriteProducts();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private getFavoriteProducts(): void {
    this.loading = true;
    this.subs.push(
      this.userService.getFavoriteProducts().subscribe({
        next: (products: Product[]) => {
          this.loading = false;
          this.favoriteProducts = products;
        },
        error: (error: any) => {
          this.loading = false;
          this.toastService.handleError(error)
        }
      })
    );
  }
}

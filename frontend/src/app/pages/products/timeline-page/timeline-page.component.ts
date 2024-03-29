import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ProductEvent } from "src/app/models/event/product-event";
import { Product } from "src/app/models/product/product";
import { PriceService } from "src/app/services/price.service";
import { ToastService } from "src/app/services/toast.service";

@Component({
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.scss']
})
export class TimelinePageComponent implements OnInit, OnDestroy {

  events: ProductEvent[] = [];
  subs: Subscription[] = [];
  loading = false;
  selectedProduct?: Product;

  constructor(
    private priceService: PriceService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.getProductEvents();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleProductChange(product: Product): void {
    this.selectedProduct = product;
    this.getProductEvents();
  }

  private getProductEvents(): void {
    if(this.selectedProduct?.id === undefined) {
      return;
    }
    this.loading = true;
    this.subs.push(
      this.priceService.getProductEvents(this.selectedProduct.id).subscribe({
        next: (events: ProductEvent[]) => {
          this.loading = false;
          this.events = events;
        },
        error: (error) => {
          this.loading = false;
          this.toastService.handleError(error);
        }
      })
    );
  }
}

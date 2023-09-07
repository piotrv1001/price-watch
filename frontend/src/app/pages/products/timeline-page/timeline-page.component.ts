import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { ProductEvent } from "src/app/models/event/product-event";
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

  getBgColorFromEvent(event: ProductEvent): string {
    switch (event.type) {
      case 'new-product':
        return 'bg-green-600';
      case 'withdrawn':
        return 'bg-gray-600';
      case 'price-change':
        return 'bg-yellow-500';
      case 're-activated':
        return 'bg-blue-500';
      default:
        return 'bg-gray-400';
    }
  }

  getIconFromEvent(event: ProductEvent): string {
    switch (event.type) {
      case 'new-product':
        return 'pi pi-shopping-cart';
      case 'withdrawn':
        return 'pi pi-minus';
      case 'price-change':
        return 'pi pi-chart-bar';
      case 're-activated':
        return 'pi pi-refresh';
      default:
        return 'pi pi-question';
    }
  }

  private getProductEvents(): void {
    this.loading = true;
    this.subs.push(
      this.priceService.getProductEvents('11917354287').subscribe({
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

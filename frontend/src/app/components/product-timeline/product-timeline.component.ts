import { Component, Input } from '@angular/core';
import { ProductEvent } from 'src/app/models/event/product-event';

@Component({
  selector: 'app-product-timeline',
  templateUrl: './product-timeline.component.html',
  styleUrls: ['./product-timeline.component.scss']
})
export class ProductTimelineComponent {
  @Input() events: ProductEvent[] = [];
  @Input() size: 'small' | 'big' = 'big';

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
}

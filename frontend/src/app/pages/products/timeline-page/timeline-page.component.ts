import { Component, OnInit } from "@angular/core";
import { ProductEvent } from "src/app/models/event/product-event";

@Component({
  selector: 'app-timeline-page',
  templateUrl: './timeline-page.component.html',
  styleUrls: ['./timeline-page.component.scss']
})
export class TimelinePageComponent implements OnInit {

  events: ProductEvent[] = [];

  ngOnInit(): void {
    this.getProductEvents();
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
    this.events = [
      { type: 'new-product', date: new Date('2020-01-01'), currentPrice: 100, imgSrc: 'https://a.allegroimg.com/s180/11222f/ed9d5a814ed88c1c5406c151575b/Lampa-sufitowa-wiszaca-Loft-Zyrandol-RETRO' },
      { type: 'price-change', date: new Date('2020-01-02'), currentPrice: 90, prevPrice: 100, priceChangePercentage: -10 },
      { type: 'price-change', date: new Date('2020-01-03'), currentPrice: 110, prevPrice: 90, priceChangePercentage: 22.22 },
      { type: 'withdrawn', date: new Date('2020-01-04'), currentPrice: 70 },
      { type: 're-activated', date: new Date('2020-01-05'), currentPrice: 80 },
      { type: 'price-change', date: new Date('2020-01-06'), currentPrice: 90, prevPrice: 80, priceChangePercentage: 12.5 },
      { type: 'withdrawn', date: new Date('2020-01-07'), currentPrice: 70 }
    ]
  }
}

import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { LayoutService } from './service/app.layout.service';

@Component({
  selector: 'app-menu',
  templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
  model: any[] = [];

  constructor(public layoutService: LayoutService) {}

  ngOnInit() {
    this.getMenuItems();
  }

  private getMenuItems(): void {
    this.model = [
      {
        label: 'menu.home',
        items: [
          { label: 'menu.dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
        ]
      },
      {
        label: 'menu.sellers',
        items: [
          { label: 'menu.sellers', icon: 'pi pi-users', routerLink: ['/sellers'] }
        ]
      },
      {
        label: 'menu.products',
        items: [
          {
            label: 'menu.prices',
            icon: 'pi pi-chart-line',
            routerLink: ['/products/prices']
          },
          {
            label: 'menu.topProducts',
            icon: 'pi pi-dollar',
            routerLink: ['/products/top-products']
          },
          {
            label: 'menu.newProducts',
            icon: 'pi pi-shopping-cart',
            routerLink: ['/products/new-products']
          },
          {
            label: 'menu.priceChanges',
            icon: 'pi pi-chart-bar',
            routerLink: ['/products/price-changes']
          },
          {
            label: 'menu.priceBuckets',
            icon: 'pi pi-chart-pie',
            routerLink: ['/products/price-buckets']
          },
          {
            label: 'menu.timeline',
            icon: 'pi pi-stopwatch',
            routerLink: ['/products/timeline']
          },
          {
            label: 'menu.favoriteProducts',
            icon: 'pi pi-star',
            routerLink: ['/products/favorite-products']
          }
        ]
      },
      {
        label: 'menu.settings',
        items: [
          { label: 'Email', icon: 'pi pi-envelope', routerLink: ['/settings/email-config'] }
        ]
      },
    ];
  }
}

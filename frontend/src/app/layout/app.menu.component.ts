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
    this.model = [
      {
        label: 'Home',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] }
        ]
      },
      {
        label: 'Products',
        items: [
          {
            label: 'New Products',
            icon: 'pi pi-shopping-cart',
            routerLink: ['/products/new-products']
          },
          {
            label: 'Price buckets',
            icon: 'pi pi-chart-pie',
            routerLink: ['/products/price-buckets']
          },
          {
            label: 'Price changes',
            icon: 'pi pi-chart-bar',
            routerLink: ['/products/price-changes']
          }
        ]
      },
      {
        label: 'Settings',
        items: [
          { label: 'Email', icon: 'pi pi-envelope', routerLink: ['/settings/email-config'] }
        ]
      },
    ];
  }
}

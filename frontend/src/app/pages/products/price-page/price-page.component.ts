import { Component } from "@angular/core";

@Component({
  selector: 'app-price-page',
  templateUrl: './price-page.component.html',
  styleUrls: ['./price-page.component.scss']
})
export class PricePageComponent {
  productIdArray: string[] = [];

  updateProductIdArray(event: string[]): void {
    this.productIdArray = event;
  }
}

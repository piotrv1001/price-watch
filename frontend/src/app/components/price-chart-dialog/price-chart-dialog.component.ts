import { Component } from "@angular/core";
import { DynamicDialogConfig } from "primeng/dynamicdialog";

@Component({
  selector: 'app-price-chart-dialog',
  templateUrl: './price-chart-dialog.component.html',
  styleUrls: ['./price-chart-dialog.component.scss']
})
export class PriceChartDialogComponent {
  productIdArray: string[] = [];

  constructor(
    private config: DynamicDialogConfig,
  ) {
    const productId = this.config?.data?.productId;
    if(productId) {
      this.productIdArray.push(productId);
    }
  }
}

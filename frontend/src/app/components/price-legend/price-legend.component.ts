import { Component, Input } from "@angular/core";
import { PriceLegend } from "src/app/types/price-legend/price-legend";

@Component({
  selector: 'app-price-legend',
  templateUrl: './price-legend.component.html',
  styleUrls: ['./price-legend.component.scss']
})
export class PriceLegendComponent {
  @Input() priceLegendArray: PriceLegend[] = [];
}

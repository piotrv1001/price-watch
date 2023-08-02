import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PriceChangeDTO } from "src/app/models/dto/price-change.dto";
import { PriceService } from "src/app/services/price.service";

@Component({
  selector: 'app-price-changes-table',
  templateUrl: './price-changes-table.component.html',
  styleUrls: ['./price-changes-table.component.scss']
})
export class PriceChangesTableComponent implements OnInit, OnDestroy {
  products: PriceChangeDTO[] = [];
  subs: Subscription[] = [];

  constructor(private priceService: PriceService) {}

  ngOnInit(): void {
    this.getPriceChanges();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  private getPriceChanges(): void {
    const seller = 'SmartLED';
    this.subs.push(
      this.priceService.getPriceChanges(seller).subscribe((products: PriceChangeDTO[]) => {
        this.products = products;
      })
    );
  }
}

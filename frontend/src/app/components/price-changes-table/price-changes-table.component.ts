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
        // this.products = products;
        const imgSrc = 'https://a.allegroimg.com/s180/11d2e3/12a8d9bb4373a6b9e41e04225b06/Zasilacz-do-tasm-LED-12V-30W-dopuszkowy-do-puszki';
        const imgSrc2 = 'https://a.allegroimg.com/s180/1103ec/0ddc0d994a8fa4d7d3babde5018d/ZASILACZ-MEBLOWY-12V-8-25A-100W-DO-TASMA-LED';
        const exampleData = [
          { name: 'Zasilacz do taśm LED 12V 30W dopuszkowy do puszki, 28,71 zł', imgSrc, prevPrice: 100, currentPrice: 105, priceChange: 5, priceChangePercentage: 5 },
          { name: 'ZASILACZ MEBLOWY 12V 8,25A 100W DO TAŚMA LED, 64,90 zł', imgSrc: imgSrc2, prevPrice: 100, currentPrice: 95, priceChange: -5, priceChangePercentage: -5 }
        ];
        this.products = exampleData;
      })
    );
  }
}

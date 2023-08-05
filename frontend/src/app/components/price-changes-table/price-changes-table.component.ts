import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PriceChangeDTO } from "src/app/models/dto/price-change.dto";
import { ChosenSellerService } from "src/app/services/chosen-seller.service";
import { PriceService } from "src/app/services/price.service";

@Component({
  selector: 'app-price-changes-table',
  templateUrl: './price-changes-table.component.html',
  styleUrls: ['./price-changes-table.component.scss']
})
export class PriceChangesTableComponent implements OnInit, OnDestroy {
  products: PriceChangeDTO[] = [];
  subs: Subscription[] = [];
  currentSellerName = 'SmartLED';

  constructor(
    private priceService: PriceService,
    private chosenSellerService: ChosenSellerService
  ) {}

  ngOnInit(): void {
    this.getPriceChanges();
    this.handleSellerChange();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleSellerChange(): void {
    this.subs.push(
      this.chosenSellerService.getCurrentSeller().subscribe((sellerName) => {
        this.currentSellerName = sellerName;
        this.getPriceChanges();
      })
    );
  }

  private getPriceChanges(): void {
    this.subs.push(
      this.priceService.getPriceChanges(this.currentSellerName).subscribe((products: PriceChangeDTO[]) => {
        // this.products = products;
        this.products = this.getFakeData();
      })
    );
  }

  private getFakeData(): PriceChangeDTO[] {
    const imgSrc = 'https://a.allegroimg.com/s180/11d2e3/12a8d9bb4373a6b9e41e04225b06/Zasilacz-do-tasm-LED-12V-30W-dopuszkowy-do-puszki';
    const imgSrc2 = 'https://a.allegroimg.com/s180/1103ec/0ddc0d994a8fa4d7d3babde5018d/ZASILACZ-MEBLOWY-12V-8-25A-100W-DO-TASMA-LED';
    const exampleData = [
      { id: 1, name: 'Zasilacz do taśm LED 12V 30W dopuszkowy do puszki, 28,71 zł', imgSrc, prevPrice: 100, currentPrice: 105, priceChange: 5, priceChangePercentage: 5, link: 'https://google.com/' },
      { id: 2, name: 'ZASILACZ MEBLOWY 12V 8,25A 100W DO TAŚMA LED, 64,90 zł', imgSrc: imgSrc2, prevPrice: 100, currentPrice: 95, priceChange: -5, priceChangePercentage: -5, link: 'https://google.com/' }
    ];
    return exampleData;
  }
}

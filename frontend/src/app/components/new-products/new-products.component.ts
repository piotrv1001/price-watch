import { Component, Input, OnChanges, OnDestroy, OnInit, SimpleChanges } from "@angular/core";
import { Subscription } from "rxjs";
import { NewProductDTO } from "src/app/models/dto/new-product.dto";
import { PriceService } from "src/app/services/price.service";
import { DateRange, DateRangeType } from "src/app/utils/date/date-range/date-range";
import { CustomDateRangeStrategy } from "src/app/utils/date/date-range/strategy/custom.strategy";

@Component({
  selector: 'app-new-products',
  templateUrl: './new-products.component.html',
  styleUrls: ['./new-products.component.scss']
})
export class NewProductsComponent implements OnInit, OnChanges, OnDestroy {
  @Input() currentSellerName?: string;
  products: NewProductDTO[] = [];
  subs: Subscription[] = [];
  dateRange: DateRange | null = null;
  startDate?: Date;
  endDate?: Date;
  selectedDropdownOption: DateRangeType | null = null;

  constructor(
    private priceService: PriceService
  ) {
    this.dateRange = new DateRange();
    this.dateRange.setDateRangeStrategy('last-week');
    this.updateDates();
  }

  ngOnInit(): void {
    this.getNewProducts();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if(changes['currentSellerName']?.currentValue !== changes['currentSellerName']?.previousValue) {
      this.getNewProducts();
    }
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleDropdownChange(dropdownOption: DateRangeType): void {
    this.selectedDropdownOption = dropdownOption;
    this.dateRange?.setDateRangeStrategy(this.selectedDropdownOption);
    this.updateDates();
    this.getNewProducts();
  }

  handleDateChange(type: 'start' | 'end', date: Date): void {
    if(type === 'start') {
      this.startDate = date;
    } else {
      this.endDate = date;
    }
    this.dateRange?.setDateRangeStrategy('custom');
    if(this.dateRange?.dateRangeStrategy instanceof CustomDateRangeStrategy && date) {
      if(type === 'start') {
        this.dateRange.dateRangeStrategy.setStartDate(date);
      } else {
        this.dateRange.dateRangeStrategy.setEndDate(date);
      }
      this.getNewProducts();
    }
  }

  private getNewProducts(): void {
    if(!this.currentSellerName) {
      return;
    }
    this.subs.push(
      this.priceService.getNewProducts(this.currentSellerName, this.startDate?.toISOString(), this.endDate?.toISOString()).subscribe((products: NewProductDTO[]) => {
        this.products = products;
      })
    );
  }

  private updateDates(): void {
    this.startDate = this.dateRange?.getStartDate();
    this.endDate = this.dateRange?.getEndDate();
  }
}

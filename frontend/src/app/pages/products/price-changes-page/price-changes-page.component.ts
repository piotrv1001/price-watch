import { Component, OnDestroy, OnInit } from "@angular/core";
import { Subscription } from "rxjs";
import { PriceChangeDTO } from "src/app/models/dto/price-change.dto";
import { Seller } from "src/app/models/seller/seller";
import { PriceService } from "src/app/services/price.service";
import { ToastService } from "src/app/services/toast.service";
import { DateRange, DateRangeType } from "src/app/utils/date/date-range/date-range";
import { CustomDateRangeStrategy } from "src/app/utils/date/date-range/strategy/custom.strategy";

@Component({
  selector: 'app-price-changes-page',
  templateUrl: './price-changes-page.component.html',
  styleUrls: ['./price-changes-page.component.scss']
})
export class PriceChangesPageComponent implements OnInit, OnDestroy {
  currentSeller: Seller | null = null;
  loading = false;
  products: PriceChangeDTO[] = [];
  subs: Subscription[] = [];
  dateRange: DateRange | null = null;
  startDate?: Date;
  endDate?: Date;
  selectedDropdownOption: DateRangeType | null = null;

  constructor(
    private priceService: PriceService,
    private toastService: ToastService
  ) {
    this.dateRange = new DateRange();
    this.dateRange.setDateRangeStrategy('last-week');
    this.updateDates();
  }

  ngOnInit(): void {
    this.currentSeller = { id: 1, name: 'SmartLED' };
    this.getPriceChanges();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
    this.getPriceChanges();
  }

  handleDropdownChange(dropdownOption: DateRangeType): void {
    this.selectedDropdownOption = dropdownOption;
    this.dateRange?.setDateRangeStrategy(this.selectedDropdownOption);
    this.updateDates();
    this.getPriceChanges();
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
      this.getPriceChanges();
    }
  }

  private getPriceChanges(): void {
    if(!this.currentSeller?.name) {
      return;
    }
    this.loading = true;
    this.subs.push(
      this.priceService.getPriceChanges(
        this.currentSeller.name,
        this.startDate?.toISOString(),
        this.endDate?.toISOString()).subscribe({
          next: (products: PriceChangeDTO[]) => {
            this.loading = false;
            this.products = products;
          },
          error: (error: any) => {
            this.loading = false;
            this.toastService.handleError(error);
          }
        })
    );
  }

  private updateDates(): void {
    this.startDate = this.dateRange?.getStartDate();
    this.endDate = this.dateRange?.getEndDate();
  }
}

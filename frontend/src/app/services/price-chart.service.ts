import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PriceChartService {
  productRemovedIndexSub: Subject<number> = new Subject<number>();

  getProductRemovedIndex(): Observable<number> {
    return this.productRemovedIndexSub.asObservable();
  }

  setProductRemovedIndex(index: number): void {
    this.productRemovedIndexSub.next(index);
  }
}

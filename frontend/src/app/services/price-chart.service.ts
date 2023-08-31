import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class PriceChartService {
  private productRemovedIndexSub: Subject<number> = new Subject<number>();
  private newProductSub: Subject<any> = new Subject<any>();
  private productsInitializedSub: Subject<void> = new Subject<void>();

  getProductRemovedIndex(): Observable<number> {
    return this.productRemovedIndexSub.asObservable();
  }

  setProductRemovedIndex(index: number): void {
    this.productRemovedIndexSub.next(index);
  }

  getNewProduct(): Observable<any> {
    return this.newProductSub.asObservable();
  }

  setNewProduct(product: any): void {
    this.newProductSub.next(product);
  }

  getProductsInitialized(): Observable<void> {
    return this.productsInitializedSub.asObservable();
  }

  setProductsInitialized(): void {
    this.productsInitializedSub.next();
  }
}

import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { HttpClient } from "@angular/common/http";
import { Product } from "../models/product/product";
import { Observable, map } from "rxjs";
import { Price } from "../models/price/price";
import { DateUtil } from "../utils/date/date.util";
import { ProductWithPrice } from "../models/product/product-with-price";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productResourceUrl = `${SERVER_API_URL}/products`;

  constructor(private http: HttpClient) {}

  getBySeller(seller: string): Observable<ProductWithPrice[]> {
    return this.http.get<Product[]>(`${this.productResourceUrl}/seller/${seller}`)
    .pipe(
      map(products => products.map(product => ({...product, currentPrice: this.getCurrentPrice(product.prices) })
    )));
  }

  private getCurrentPrice(prices: Price[] | undefined): number | undefined {
    if(!prices) {
      return undefined;
    }
    const pricesSortedByDate = prices.sort((a, b) => {
      const aDate = DateUtil.getDate(a.date);
      const bDate = DateUtil.getDate(b.date);
      if(aDate && bDate) {
        return bDate.getTime() - aDate.getTime();
      }
      return 0;
    });
    return pricesSortedByDate[0].price;
  }
}

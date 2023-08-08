
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { Observable } from "rxjs";
import { NewProductDTO } from "../models/dto/new-product.dto";
import { PriceChangeDTO } from "../models/dto/price-change.dto";

@Injectable({
  providedIn: 'root',
})
export class PriceService {

  private priceResourceUrl = `${SERVER_API_URL}/prices`;

  constructor(private http: HttpClient) {}

  getPricesByProductIds(productIds: string[]): Observable<Record<string, number[]>> {
    return this.http.post<Record<string, number[]>>(`${this.priceResourceUrl}/by-product-ids`, productIds);
  }

  getNewProducts(seller: string, fromDate?: string, toDate?: string): Observable<NewProductDTO[]> {
    if(!fromDate || !toDate) {
      return this.http.get<NewProductDTO[]>(`${this.priceResourceUrl}/new-products/${seller}`);
    }
    return this.http.get<NewProductDTO[]>(`${this.priceResourceUrl}/new-products/${seller}?fromDate=${fromDate}&toDate=${toDate}`);
  }

  getPriceChanges(seller: string, fromDate?: string, toDate?: string): Observable<PriceChangeDTO[]> {
    if(!fromDate || !toDate) {
      return this.http.get<PriceChangeDTO[]>(`${this.priceResourceUrl}/price-changes/${seller}`);
    }
    return this.http.get<PriceChangeDTO[]>(`${this.priceResourceUrl}/price-changes/${seller}?fromDate=${fromDate}&toDate=${toDate}`);
  }
}

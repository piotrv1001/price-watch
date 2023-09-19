
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { Observable } from "rxjs";
import { NewProductDTO } from "../models/dto/new-product.dto";
import { PriceChangeDTO } from "../models/dto/price-change.dto";
import { CreatePriceDTO } from "../models/dto/create-price.dto";
import { ProductEvent } from "../models/event/product-event";

@Injectable({
  providedIn: 'root',
})
export class PriceService {

  private priceResourceUrl = `${SERVER_API_URL}/prices`;

  constructor(private http: HttpClient) {}

  getPricesByProductIds(productIds: string[], fromDate?: string, toDate?: string): Observable<Record<string, CreatePriceDTO[]>> {
    if(!fromDate || !toDate) {
      return this.http.post<Record<string, CreatePriceDTO[]>>(`${this.priceResourceUrl}/by-product-ids`, productIds);
    }
    return this.http.post<Record<string, CreatePriceDTO[]>>(`${this.priceResourceUrl}/by-product-ids?fromDate=${fromDate}&toDate=${toDate}`, productIds);
  }

  getNewProducts(seller: string, fromDate?: string, toDate?: string, limit = 100): Observable<NewProductDTO[]> {
    if(!fromDate || !toDate) {
      return this.http.get<NewProductDTO[]>(`${this.priceResourceUrl}/new-products/${seller}?limit=${limit}`);
    }
    return this.http.get<NewProductDTO[]>(`${this.priceResourceUrl}/new-products/${seller}?fromDate=${fromDate}&toDate=${toDate}&limit=${limit}`);
  }

  getPriceChanges(seller: string, fromDate?: string, toDate?: string): Observable<PriceChangeDTO[]> {
    if(!fromDate || !toDate) {
      return this.http.get<PriceChangeDTO[]>(`${this.priceResourceUrl}/price-changes/${seller}`);
    }
    return this.http.get<PriceChangeDTO[]>(`${this.priceResourceUrl}/price-changes/${seller}?fromDate=${fromDate}&toDate=${toDate}`);
  }

  getProductEvents(productId: string): Observable<ProductEvent[]> {
    return this.http.get<ProductEvent[]>(`${this.priceResourceUrl}/product-events/${productId}`);
  }
}

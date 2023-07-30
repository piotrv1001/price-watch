
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

  getNewProducts(seller: string): Observable<NewProductDTO[]> {
    return this.http.get<NewProductDTO[]>(`${this.priceResourceUrl}/new-products/${seller}`);
  }

  getPriceChanges(seller: string): Observable<PriceChangeDTO[]> {
    return this.http.get<PriceChangeDTO[]>(`${this.priceResourceUrl}/price-changes/${seller}`);
  }
}

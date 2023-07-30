import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class PriceService {

  private priceResourceUrl = `${SERVER_API_URL}/prices`;

  constructor(private http: HttpClient) {}

  getPricesByProductIds(productIds: string[]): Observable<Record<string, number[]>> {
    return this.http.post<Record<string, number[]>>(`${this.priceResourceUrl}/by-product-ids`, productIds);
  }
}

import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { HttpClient } from "@angular/common/http";
import { Product } from "../models/product/product";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private productResourceUrl = `${SERVER_API_URL}/products`;

  constructor(private http: HttpClient) {}

  getBySeller(seller: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.productResourceUrl}/seller/${seller}`);
  }
}

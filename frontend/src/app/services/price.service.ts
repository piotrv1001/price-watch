import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";

@Injectable({
  providedIn: 'root',
})
export class PriceService {

  private priceResourceUrl = `${SERVER_API_URL}/prices`;

  constructor(private http: HttpClient) {}
}

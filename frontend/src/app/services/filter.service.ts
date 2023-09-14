import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { HttpClient } from "@angular/common/http";
import { Filter } from "../models/filter/filter";
import { CreateFilterDTO } from '../models/dto/create-filter.dto';

@Injectable({
  providedIn: 'root'
})
export class FilterService {
  private filterResourceUrl = `${SERVER_API_URL}/filters`;

  constructor(private http: HttpClient) {}

  getFilters(): Observable<Filter[]> {
    return this.http.get<Filter[]>(this.filterResourceUrl);
  }

  createFilter(createFilterDTO: CreateFilterDTO): Observable<Filter> {
    return this.http.post<Filter>(this.filterResourceUrl, createFilterDTO);
  }

  deleteFilter(id: string): Observable<void> {
    return this.http.delete<void>(`${this.filterResourceUrl}/${id}`);
  }
}

import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { HttpClient, HttpEvent } from "@angular/common/http";
import { ExportDataDTO } from "../models/dto/export-data.dto";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private exportResourceUrl = `${SERVER_API_URL}/export`;
  private excelResourceUrl = `${this.exportResourceUrl}/excel`;

  constructor(private http: HttpClient) {}

  downloadExcel(exportDataDTO: ExportDataDTO): Observable<HttpEvent<Blob>> {
    return this.http.post(this.excelResourceUrl, exportDataDTO, {
      reportProgress: true,
      responseType: 'blob',
      observe: 'events'
    });
  }

  downloadPdf(exportDataDTO: ExportDataDTO): Observable<Blob> {
    return this.http.post(`${this.exportResourceUrl}/pdf`, exportDataDTO, {
      responseType: 'blob'
    });
  }
}

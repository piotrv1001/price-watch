import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { HttpClient } from "@angular/common/http";
import { ExportDataDTO } from "../models/dto/export-data.dto";
import { Observable } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ExportService {

  private exportResourceUrl = `${SERVER_API_URL}/export`;
  private excelResourceUrl = `${this.exportResourceUrl}/excel`;

  constructor(private http: HttpClient) {}

  downloadExcel(exportDataDTO: ExportDataDTO): Observable<Blob> {
    return this.http.post(this.excelResourceUrl, exportDataDTO, {
      responseType: 'blob',
    });
  }
}

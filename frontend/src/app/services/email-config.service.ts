import { Observable } from 'rxjs';
import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { SERVER_API_URL } from "../app.constants";
import { CreateEmailConfigDTO } from '../models/dto/create-email-config.dto';
import { EmailConfig } from '../models/email-config/email-config';

@Injectable({
  providedIn: 'root'
})
export class EmailConfigService {

  private emailConfigResourceUrl = `${SERVER_API_URL}/email-config`

  constructor(private http: HttpClient) {}

  getByUserId(): Observable<EmailConfig | null> {
    return this.http.get<EmailConfig | null>(`${this.emailConfigResourceUrl}/user`);
  }

  create(emailConfig: CreateEmailConfigDTO): Observable<EmailConfig> {
    return this.http.post<EmailConfig>(`${this.emailConfigResourceUrl}`, emailConfig);
  }

  update(emailConfig: CreateEmailConfigDTO): Observable<EmailConfig> {
    return this.http.put<EmailConfig>(`${this.emailConfigResourceUrl}`, emailConfig);
  }
}

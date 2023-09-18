import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { SERVER_API_URL } from "../app.constants";

@Injectable({
  providedIn: 'root'
})
export class PasswordResetService {
  PASSWORD_RESET_ROUTE = 'password-reset';

  constructor(private http: HttpClient) { }

  forgotPassword(email: string): Observable<void> {
    return this.http.post<void>(`${SERVER_API_URL}/${this.PASSWORD_RESET_ROUTE}/forgot`, { email });
  }

  resetPassword(token: string, password: string): Observable<void> {
    return this.http.post<void>(`${SERVER_API_URL}/${this.PASSWORD_RESET_ROUTE}/reset`, { token, password });
  }

  validateToken(token: string): Observable<void> {
    return this.http.get<void>(`${SERVER_API_URL}/${this.PASSWORD_RESET_ROUTE}/validate-token/${token}`);
  }
}

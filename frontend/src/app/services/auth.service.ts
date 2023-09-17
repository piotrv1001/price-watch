import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Observable, map, catchError, of } from "rxjs";
import { User } from "../models/user/user";
import { SERVER_API_URL } from "../app.constants";

export type Tokens = {
  access_token: string;
  refresh_token: string;
};

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private firebaseToken?: string;

  constructor(private http: HttpClient) { }

  REGISTER_ROUTE = 'register';
  LOGIN_ROUTE = 'auth/login';
  AUTH_ROUTE = 'authenticate';
  VERIFY_FIREBASE_TOKEN_ROUTE = 'auth/verify-token';
  tokenExpiredSubject: Subject<void> = new Subject<void>();

  getAccessToken(): string | null {
    return this.firebaseToken ?? localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }

  getTokenExpired(): Observable<void> {
    return this.tokenExpiredSubject.asObservable();
  }

  setTokenExpired(): void {
    this.tokenExpiredSubject.next();
  }

  isAuthenticated(): Observable<any> {
    return this.http.get<any>(`${SERVER_API_URL}/${this.AUTH_ROUTE}`);
  }

  refreshTokens(): Observable<Tokens> {
    return this.http.post<Tokens>(`${SERVER_API_URL}/auth/refresh`, {}, {
      headers: {
        Authorization: `Bearer ${this.getRefreshToken()}`
      }
    });
  }

  register(userDTO: User): Observable<User> {
    return this.http.post<User>(`${SERVER_API_URL}/${this.REGISTER_ROUTE}`, userDTO);
  }

  login(userDTO: User): Observable<void> {
    return this.http.post<Tokens>(`${SERVER_API_URL}/${this.LOGIN_ROUTE}`, userDTO)
      .pipe(map(response => this.saveTokensToLocalStorage(response)));
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${SERVER_API_URL}/auth/logout`, {})
      .pipe(map(() => localStorage.clear()));
  }

  verifyFirebaseToken(idToken: string): Observable<boolean> {
    return this.http.post<void>(`${SERVER_API_URL}/${this.VERIFY_FIREBASE_TOKEN_ROUTE}`, { idToken })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  saveTokensToLocalStorage(response: Tokens): void {
    const { access_token, refresh_token } = response;
    localStorage.setItem('access_token', access_token);
    localStorage.setItem('refresh_token', refresh_token);
  }

  setFirebaseToken(token?: string): void {
    this.firebaseToken = token;
  }

  removeFirebaseToken(): void {
    this.firebaseToken = undefined;
  }

}

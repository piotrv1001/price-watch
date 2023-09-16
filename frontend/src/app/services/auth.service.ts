import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Observable, map, catchError, of } from "rxjs";
import { User } from "../models/user/user";
import { SERVER_API_URL } from "../app.constants";

type JwtToken = { access_token: string };
type JwtPayload = { id: number, username: string };

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

  getToken(): string | null {
    return this.firebaseToken ?? localStorage.getItem('token');
  }

  getTokenExpired(): Observable<void> {
    return this.tokenExpiredSubject.asObservable();
  }

  setTokenExpired(): void {
    this.tokenExpiredSubject.next();
  }

  isAuthenticated(): Observable<JwtPayload> {
    return this.http.get<JwtPayload>(`${SERVER_API_URL}/${this.AUTH_ROUTE}`);
  }

  register(userDTO: User): Observable<User> {
    return this.http.post<User>(`${SERVER_API_URL}/${this.REGISTER_ROUTE}`, userDTO);
  }

  login(userDTO: User): Observable<void> {
    return this.http.post<JwtToken>(`${SERVER_API_URL}/${this.LOGIN_ROUTE}`, userDTO)
      .pipe(map(response => this.saveTokenToLocalStorage(response)));
  }

  logout(): Promise<void> {
    return new Promise(resolve => {
      localStorage.clear();
      resolve();
    });
  }

  verifyFirebaseToken(idToken: string): Observable<boolean> {
    return this.http.post<void>(`${SERVER_API_URL}/${this.VERIFY_FIREBASE_TOKEN_ROUTE}`, { idToken })
      .pipe(
        map(() => true),
        catchError(() => of(false))
      );
  }

  saveTokenToLocalStorage(response: JwtToken): void {
    const { access_token } = response;
    localStorage.setItem('token', access_token);
  }

  setFirebaseToken(token?: string): void {
    this.firebaseToken = token;
  }

  removeFirebaseToken(): void {
    this.firebaseToken = undefined;
  }

}

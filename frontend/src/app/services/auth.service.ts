import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject, Observable, map } from "rxjs";
import { User } from "../models/user/user";
import { SERVER_API_URL } from "../app.constants";

type JwtToken = { access_token: string };
type JwtPayload = { id: number, username: string };

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(private http: HttpClient) { }

  REGISTER_ROUTE = 'register';
  LOGIN_ROUTE = 'auth/login';
  AUTH_ROUTE = 'authenticate';
  VERIFY_FIREBASE_TOKEN_ROUTE = 'auth/verify-token';
  isAuthSubject: Subject<boolean> = new Subject<boolean>();

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getAuthObs(): Observable<boolean> {
    return this.isAuthSubject.asObservable();
  }

  authenticate(): void {
    this.isAuthSubject.next(true);
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

  verifyFirebaseToken(idToken: string): Observable<void> {
    return this.http.post<JwtToken>(`${SERVER_API_URL}/${this.VERIFY_FIREBASE_TOKEN_ROUTE}`, { idToken })
    .pipe(map(response => this.saveTokenToLocalStorage(response)));
  }

  saveTokenToLocalStorage(response: JwtToken): void {
    const { access_token } = response;
    localStorage.setItem('token', access_token);
  }

}

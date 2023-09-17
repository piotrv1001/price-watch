import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';

import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';
import { AuthService, Tokens } from '../services/auth.service';

@Injectable()
export class HttpRequestInterceptor implements HttpInterceptor {
  private isRefreshing = false;

  constructor(
    private authService: AuthService
  ) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const authToken = this.authService.getAccessToken() ?? '';
    const request = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`)
    });
    return next.handle(request).pipe(
      catchError((error) => {
        if (error.status === 401) {
          return this.handle401Error(req, next);
        }
        return throwError(() => error);
      })
    );
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      return this.authService.refreshTokens().pipe(
        switchMap((tokens: Tokens) => {
          this.isRefreshing = false;
          this.authService.saveTokensToLocalStorage(tokens);
          const accessToken = tokens.access_token;
          const updatedRequest = request.clone({
            headers: request.headers.set('Authorization', `Bearer ${accessToken}`)
          });
          return next.handle(updatedRequest);
        }),
        catchError((error) => {
          this.isRefreshing = false;
          if (error.status === 401) {
            this.authService.setTokenExpired();
          }
          return throwError(() => error);
        })
      );
    }
    return next.handle(request);
  }
}

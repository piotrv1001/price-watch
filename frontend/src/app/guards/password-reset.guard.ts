import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable, catchError, map, of } from 'rxjs';
import { PasswordResetService } from '../services/password-reset.service';

export const passwordResetGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
):
  | Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree => {
  const passwordResetService = inject(PasswordResetService);
  return passwordResetService.validateToken(route.params['token']).pipe(
    map(() => true),
    catchError(() => of(false))
  );
};

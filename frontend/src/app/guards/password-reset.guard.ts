import { inject } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivateFn,
  Router,
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
  const router = inject(Router);
  const token = route.params['token'];
  return passwordResetService.validateToken(token).pipe(
    map(() => true),
    catchError(() => of(router.createUrlTree(['/not-found'])))
  );
};

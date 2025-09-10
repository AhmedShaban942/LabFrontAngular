import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Observable, of } from 'rxjs';
import { switchMap } from 'rxjs/operators';

export const authGuard: CanActivateFn = (
  route: ActivatedRouteSnapshot,
  state: RouterStateSnapshot
): Observable<boolean> | boolean => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // إذا المستخدم مسجّل دخول والتوكن صالح
  if (authService.isAuthenticated()) {
    return true;
  }

  // إذا التوكن موجود لكنه منتهي، حاول التجديد
  if (authService.token()) {
    return authService.refreshToken().pipe(
      switchMap(success => {
        if (success) {
          return of(true); // التجديد ناجح، سمح بالدخول
        } else {
          router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return of(false);
        }
      })
    );
  }

  // إذا لا يوجد توكن أو لا يمكن التجديد
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

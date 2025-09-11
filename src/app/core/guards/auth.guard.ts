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

  // 👇 أقرأ البيانات المطلوبة من route (roles / permissions)
  const requiredRoles = route.data['roles'] as string[] | undefined;
  const requiredPermissions = route.data['permissions'] as string[] | undefined;

  // ✅ لو المستخدم مسجل دخول والتوكن صالح
  if (authService.isAuthenticated()) {
    if (!hasAccess(authService, requiredRoles, requiredPermissions)) {
      router.navigate(['/forbidden']);
      return false;
    }
    return true;
  }

  // ✅ لو التوكن موجود لكنه منتهي → جرب التجديد
  if (authService.token()) {
    return authService.refreshToken().pipe(
      switchMap(success => {
        if (success) {
          if (!hasAccess(authService, requiredRoles, requiredPermissions)) {
            router.navigate(['/forbidden']);
            return of(false);
          }
          return of(true);
        } else {
          router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
          return of(false);
        }
      })
    );
  }

  // 🚫 لا يوجد توكن أو فشل التجديد → توجيه للـ login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};

// 🔹 دالة مساعدة لفحص الوصول
function hasAccess(authService: AuthService, roles?: string[], permissions?: string[]): boolean {
  // تحقق من الأدوار
  if (roles && !roles.some(r => authService.roles().includes(r))) {
    return false;
  }

  // تحقق من الصلاحيات
  if (permissions && !permissions.some(p => authService.permissions().includes(p))) {
    return false;
  }

  return true;
}

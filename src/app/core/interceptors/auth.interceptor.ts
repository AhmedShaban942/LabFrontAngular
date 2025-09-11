import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { TranslateService } from '@ngx-translate/core';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);
  const translate = inject(TranslateService);

  // 👇 إضافة Authorization Header إذا كان التوكن موجود
  const token = authService.token();
  let headers = req.headers;

  if (token) {
    headers = headers.set('Authorization', `Bearer ${token}`);
  }

  // 👇 إضافة اللغة (Accept-Language) حسب اختيار المستخدم
  const currentLang = translate.currentLang || 'en'; // default لو مش محدد
  const culture = currentLang === 'ar' ? 'ar-SA' : 'en-US'; // mapping
  headers = headers.set('Accept-Language', culture);

  const authReq = req.clone({ headers });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 👇 إذا كانت الاستجابة 401، حاول تجديد التوكن
      if (error.status === 401 && !req.url.includes('/auth/refresh-token')) {
        return authService.refreshToken().pipe(
          switchMap(success => {
            if (success) {
              const newToken = authService.token();
              let newHeaders = req.headers.set('Accept-Language', culture);
              if (newToken) {
                newHeaders = newHeaders.set('Authorization', `Bearer ${newToken}`);
              }
              const newReq = req.clone({ headers: newHeaders });
              return next(newReq);
            } else {
              authService.logout();
              return throwError(() => error);
            }
          })
        );
      }

      // أي خطأ آخر
      return throwError(() => error);
    })
  );
};

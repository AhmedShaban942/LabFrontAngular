import { Injectable, inject } from '@angular/core';
import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpEvent, HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../services/auth.service';
import { Observable, throwError, from } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<any>> => {
  const authService = inject(AuthService);

  // 👇 إضافة Authorization Header إذا كان التوكن موجود
  const token = authService.token();
  let authReq = req;
  if (token) {
    authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`)
    });
  }

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      // 👇 إذا كانت الاستجابة 401، حاول تجديد التوكن
      if (error.status === 401) {
        return authService.refreshToken().pipe(
          switchMap(success => {
            if (success) {
              // إعادة إرسال الطلب مع التوكن الجديد
              const newToken = authService.token();
              const newReq = req.clone({
                headers: req.headers.set('Authorization', `Bearer ${newToken}`)
              });
              return next(newReq);
            } else {
              // إذا لم ينجح التجديد، تسجيل خروج
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

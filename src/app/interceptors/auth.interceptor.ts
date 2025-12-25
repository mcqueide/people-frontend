import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError, from, switchMap } from 'rxjs';
import { AuthService } from '../services/auth.service';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);

  // Only add token to API requests
  if (!req.url.includes('/api/')) {
    return next(req);
  }

  // Check if token needs refresh
  if (authService.isTokenExpired()) {
    return from(authService.updateToken()).pipe(
      switchMap(() => {
        const token = authService.getToken();
        const cloned = token ? req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`
          }
        }) : req;
        
        return next(cloned);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 401) {
          authService.logout();
        }
        return throwError(() => error);
      })
    );
  }

  const token = authService.getToken();
  const cloned = token ? req.clone({
    setHeaders: {
      Authorization: `Bearer ${token}`
    }
  }) : req;

  return next(cloned).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
      }
      return throwError(() => error);
    })
  );
};
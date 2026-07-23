import {
  HttpInterceptorFn,
  HttpErrorResponse
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

export const authInterceptor: HttpInterceptorFn =
(req, next) => {
  const token = localStorage.getItem('access_token');
  const router = inject(Router);
  const toastService = inject(ToastService);

  if (token) {
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`
      }
    });
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        localStorage.clear();
        router.navigate(['/login']);
        toastService.error('Session Expired', 'Your session has expired. Please login again.');
      }
      return throwError(() => error);
    })
  );
};
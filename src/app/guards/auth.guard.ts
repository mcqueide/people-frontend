import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = (route) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  // Save the intended URL for redirect after login
  const url = route.url.map(segment => segment.path).join('/');
  authService.login(`/${url}`);
  return false;
};
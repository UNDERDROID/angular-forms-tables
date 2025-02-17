// guards/superadmin.guard.ts
import { inject } from '@angular/core';
import { Router, type CanActivateFn } from '@angular/router';
import { UserService } from '../../services/user.service';


export const superadminGuard: CanActivateFn = (route, state) => {
  const userService = inject(UserService);
  const router = inject(Router);

  if (userService.isSuperAdmin()) {
    return true;
  }

  // Redirect to home or show unauthorized message
  router.navigate(['/home']);
  return false;
};
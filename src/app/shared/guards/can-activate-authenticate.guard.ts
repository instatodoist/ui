import { Injectable } from '@angular/core';
import {
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot
} from '@angular/router';
import { Router } from '@angular/router';
import { LsService } from '../../service/ls.service';

@Injectable()
export class CanActivateAuthenticateGuard implements CanActivate {
  constructor(
    private lsService: LsService,
    private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (this.lsService.getValue('isLoggedIn') && state.url === '/') {
      this.router.navigate(['/tasks/inbox']);
    } else if (this.lsService.getValue('isLoggedIn') && state.url !== '/') {
      return true;
    } else if (!this.lsService.getValue('isLoggedIn') && state.url !== '/' && state.url !== '/register') {
      this.router.navigate(['/']);
      return false;
    } else {
      return true;
    }
  }
}

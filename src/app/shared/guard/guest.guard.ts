import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { TokenStorageService } from '../services/token-storage.service';

@Injectable({
  providedIn: 'root'
})
export class GuestGuard implements CanActivate {
  isLoggedIn = false;
  private roles: string[];
  constructor(
    public tokenStorageService: TokenStorageService,
    public router: Router
  ) { }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
    this.isLoggedIn = !!this.tokenStorageService.getToken();
    if (this.isLoggedIn !== true) {
      this.router.navigate(['/login'])
      return false;
    }
    if (this.isLoggedIn === true) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      if (this.roles[0] === "ROLE_GUEST") {
        return true;
      }
      this.router.navigate(['/login'])
    }
  }
}

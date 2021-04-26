/*tslint:disable*/
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot, RouterStateSnapshot,
  UrlTree, CanActivate, Router
} from '@angular/router';
import { TokenStorageService } from '../services/token-storage.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
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
    if (this.isLoggedIn === true) {
      const user = this.tokenStorageService.getUser();
      this.roles = user.roles;
      if (this.roles[0] === "ROLE_OWNER") {
        this.router.navigate(['/owner'])
      } else if (this.roles[0] === "ROLE_GUEST") {
        this.router.navigate(['/guest'])
      } else if (this.roles[0] === "ROLE_USER") {
        return false
      }
    }
    return true
  }
}

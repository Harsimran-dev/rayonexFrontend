import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { StoreService } from '../store/store.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GuardService implements CanActivate {
  constructor(private router: Router) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): boolean | UrlTree | Observable<boolean | UrlTree> | Promise<boolean | UrlTree> {
      return this.checkLogin(state.url);
  }

  private checkLogin(url: string): boolean | UrlTree {
    const isAuthenticated = this.isAuthenticated();
    const userRole = StoreService.getUserRole();
    console.log('IsAuthenticated:', isAuthenticated);
    console.log('UserRole:', userRole);

    if (isAuthenticated && (userRole === 'ADMIN' || userRole === 'USER')) {
      return true;
    } else {
      return this.router.createUrlTree(['/login'], { queryParams: { returnUrl: url } }); 
    }
  }

  private isAuthenticated(): boolean {
    return !!StoreService.getToken();
  }
}

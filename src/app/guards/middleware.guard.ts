import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { TOKEN_KEY } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';
import { Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MiddlewareGuard implements CanActivate {
  constructor(private router: Router, @Inject(PLATFORM_ID) private platformId: Object) { }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    const currentPath = state.url;
    const isProtected = route.data['isProtected'];

    return new Observable<boolean>(observer => {
      if (isProtected) {
        this.checkAuthentication(observer);
      } else {
        this.checkLoginRedirect(currentPath, observer);
      }
    });
  }

  private checkAuthentication(observer: any) {
    if (isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (!isExpired) {
            observer.next(true);
          } else {
            this.router.navigate(['/login']);
            observer.next(false);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          observer.next(false);
        }
      } else {
        this.router.navigate(['/login']);
        observer.next(false);
      }
    } else {
      observer.next(false);
    }
    observer.complete();
  }

  private checkLoginRedirect(currentPath: string, observer: any) {
    if (currentPath === "/login" && isPlatformBrowser(this.platformId)) {
      const token = sessionStorage.getItem(TOKEN_KEY);
      if (token) {
        try {
          const decoded: any = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now();

          if (!isExpired) {
            this.router.navigate(['/home']);
            observer.next(false);
          } else {
            observer.next(true);
          }
        } catch (error) {
          console.error('Error decoding token:', error);
          observer.next(true);
        }
      } else {
        observer.next(true);
      }
    } else {
      observer.next(true);
    }
    observer.complete();
  }
}

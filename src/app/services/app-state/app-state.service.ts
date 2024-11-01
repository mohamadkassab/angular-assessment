import { Injectable, signal } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class StateService {

  private _status = new BehaviorSubject<string>('idle');
  status$ = this._status.asObservable();
  getStatus$() {
    return this.status$;
  }
  updateStatus(value: string) {
    this._status.next(value);
  }

  private _currentPage = new BehaviorSubject<string>('Home');
  currentPage$ = this._currentPage.asObservable();
  getCurrentPage$() {
    return this.currentPage$;
  }
  updateCurrentPage(value: string) {
    this._currentPage.next(value);
  }

  private email = signal<string>('');
  getEmail$() {
    return this.email;
  }
  updateEmail(newEmail: string) {
    this.email.set(newEmail);
  }

  private isAuthenticated = signal<boolean>(false);
  getIsAuthenticated$() {
    return this.isAuthenticated;
  }
  updateIsAuthenticated(value: boolean) {
    this.isAuthenticated.set(value);
  }
}

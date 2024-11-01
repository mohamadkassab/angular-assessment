import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StateService {
 
  private email = signal<string>('');
  private isAuthenticated = signal<boolean>(false);

  get email$() {
    return this.email;
  }

  updateEmail(newEmail: string) {
    this.email.set(newEmail);
  }

  get isAuthenticated$() {
    return this.isAuthenticated;
  }

  updateIsAuthenticated(value: boolean) {
    this.isAuthenticated.set(value);
  }
}

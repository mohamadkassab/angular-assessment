// session-management.service.ts
import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.dev';
import { SignalService } from '../signal/signal.service';

@Injectable({
  providedIn: 'root',
})
export class SessionManagementService {
  constructor(
    private signalService: SignalService,
  ) { }

  setSession(sessionData: any): void {
    sessionStorage.setItem(environment.TOKEN_KEY, JSON.stringify(sessionData));
    this.signalService.updateEmail$(sessionData?.email);
    this.signalService.updateRole$("Admin");
    this.signalService.updateIsAuthenticated$(true);
  }

  getSession(): any | null {
    const session = sessionStorage.getItem(environment.TOKEN_KEY);
    return session ? JSON.parse(session) : null;
  }

  endSession(): void {
    sessionStorage.removeItem(environment.TOKEN_KEY);
    this.signalService.updateIsAuthenticated$(false);
    this.signalService.updateEmail$(null);
  }
}
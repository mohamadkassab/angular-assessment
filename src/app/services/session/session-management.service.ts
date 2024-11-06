// session-management.service.ts
import { Injectable } from '@angular/core';
import { TOKEN_KEY } from '../../utils/constants';
import { SignalService } from '../signal/signal.service';

@Injectable({
  providedIn: 'root',
})
export class SessionManagementService {
  constructor(
    private signalService: SignalService,
  ) { }

  setSession(sessionData: any): void {
    sessionStorage.setItem(TOKEN_KEY, JSON.stringify(sessionData));
    this.signalService.updateEmail$(sessionData?.email);
    this.signalService.updateIsAuthenticated$(true);
  }

  getSession(): any | null {
    const session = sessionStorage.getItem(TOKEN_KEY);
    return session ? JSON.parse(session) : null;
  }

  endSession(): void {
    sessionStorage.removeItem(TOKEN_KEY);
    this.signalService.updateIsAuthenticated$(false);
    this.signalService.updateEmail$(null);
  }
}
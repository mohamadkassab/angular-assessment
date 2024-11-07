import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { SignalService } from '../signal/signal.service';
import { TOKEN_KEY } from '../../utils/constants';
import { environment } from '../../../environments/environment.dev';
import { getAuth, signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { TIMEOUT_DURATION } from '../../utils/constants';
import { StatusModel } from '../../models/status.model';
import { SessionManagementService } from '../session/session-management.service';

const app = initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private signalService: SignalService,
    private router: Router,
    private sessionManagementService: SessionManagementService
  ) { }

  private auth = getAuth(app);

  private createTimeoutPromise(): Promise<void> {
    return new Promise((_, reject) => {
      setTimeout(() => {
        reject(new Error('Operation timed out'));
      }, TIMEOUT_DURATION);
    });
  }

  async signIn(email: string, password: string): Promise<void> {
    try {
      this.signalService.updateStatus$(StatusModel.LOADING);
      const signInPromise = signInWithEmailAndPassword(this.auth, email, password);
      await Promise.race([signInPromise, this.createTimeoutPromise()]);
      const userCredential = await signInPromise;
      const user = userCredential.user;
      console.log(userCredential)
      if (user.email) {
        const token = await user.getIdToken();
        this.sessionManagementService.setSession(token);
        this.router.navigate(['/home']);
      }else{
        this.signalService.pushErrorMessage(`Login failed`);
      }
    } catch (e) {
      this.signalService.pushErrorMessage(`Login failed`);
      throw e;
    }
    finally{
      this.signalService.updateStatus$(StatusModel.IDLE);
    }
  }

  async signOut(): Promise<void> {
    try {
      const signOutPromise = signOut(this.auth);
      await Promise.race([signOutPromise, this.createTimeoutPromise()]);
      await signOutPromise;
      this.sessionManagementService.endSession();
      this.router.navigate(['/login']);
    } catch (e) {
      this.signalService.pushErrorMessage(`Sign-out error: ${e}`);
    }
  }
}

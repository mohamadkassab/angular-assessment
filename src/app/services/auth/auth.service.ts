import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { initializeApp } from 'firebase/app';
import { StateService } from '../app-state/app-state.service';
import { TOKEN_NAME } from '../../utils/constants';
import { environment } from '../../../environments/environment';
import { getAuth, signInWithEmailAndPassword,signOut } from 'firebase/auth';
import { TIMEOUT_DURATION } from '../../utils/constants';

const app = initializeApp(environment.firebase);

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(
    private stateService: StateService,
    private router: Router
  ) {}

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
      const signInPromise = signInWithEmailAndPassword(this.auth, email, password);
      await Promise.race([signInPromise, this.createTimeoutPromise()]);
      const userCredential = await signInPromise;
      const user = userCredential.user;

      if (user.email) {
        this.stateService.updateEmail(user.email);
        this.stateService.updateIsAuthenticated(true);
        const token = await user.getIdToken();
        localStorage.setItem(TOKEN_NAME, token);
        this.router.navigate(['/home']);
      }
    } catch (e) {
      console.error('Sign-in error:', e);
      throw e; 
    }
  }

  async signOut(): Promise<void> {
    try {
      const signOutPromise = signOut(this.auth);
      await Promise.race([signOutPromise, this.createTimeoutPromise()]);
      await signOutPromise;
      localStorage.removeItem(TOKEN_NAME);
      this.stateService.updateIsAuthenticated(false);
      this.stateService.updateEmail('');
      this.router.navigate(['/login']);
    } catch (e) {
      console.error('Sign-out error:', e);
    }
  }
}

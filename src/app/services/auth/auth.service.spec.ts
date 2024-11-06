import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { SignalService } from '../signal/signal.service';
import { Router } from '@angular/router';
import { SessionManagementService } from '../session/session-management.service';
import { of, throwError } from 'rxjs';
import { getAuth, signInWithEmailAndPassword, signOut, Auth } from 'firebase/auth';
import { StatusModel } from '../../models/status.model';

class MockSignalService {
  updateStatus$ = jasmine.createSpy('updateStatus$');
  pushErrorMessage = jasmine.createSpy('pushErrorMessage');
}

class MockRouter {
  navigate = jasmine.createSpy('navigate');
}

class MockSessionManagementService {
  setSession = jasmine.createSpy('setSession');
  endSession = jasmine.createSpy('endSession');
}

describe('AuthService', () => {
  let authService: AuthService;
  let signalService: SignalService;
  let router: Router;
  let sessionManagementService: SessionManagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: SignalService, useClass: MockSignalService },
        { provide: Router, useClass: MockRouter },
        { provide: SessionManagementService, useClass: MockSessionManagementService }
      ]
    });

    authService = TestBed.inject(AuthService);
    signalService = TestBed.inject(SignalService);
    router = TestBed.inject(Router);
    sessionManagementService = TestBed.inject(SessionManagementService);
  });

  describe('signOut', () => {
    it('should sign out successfully and navigate to login', async () => {
      spyOn<any>(authService['auth'], 'signOut').and.returnValue(Promise.resolve());
      await authService.signOut();
      expect(sessionManagementService.endSession).toHaveBeenCalled();
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });

    it('should handle sign-out error and show error message', async () => {
      spyOn<any>(authService['auth'], 'signOut').and.returnValue(Promise.reject('Sign-out failed'));
      await authService.signOut();
      expect(signalService.pushErrorMessage).toHaveBeenCalledWith('Sign-out error: Sign-out failed');
    });

    it('should handle timeout during sign-out', async () => {
      spyOn<any>(authService, 'createTimeoutPromise').and.returnValue(Promise.reject(new Error('Operation timed out')));
      spyOn<any>(authService['auth'], 'signOut').and.returnValue(Promise.reject('Timeout'));
      await authService.signOut();
      expect(signalService.pushErrorMessage).toHaveBeenCalledWith('Sign-out error: Timeout');
    });
  });
});

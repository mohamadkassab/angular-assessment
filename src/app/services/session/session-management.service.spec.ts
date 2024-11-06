import { TestBed } from '@angular/core/testing';
import { SessionManagementService } from './session-management.service';
import { SignalService } from '../signal/signal.service';
import { TOKEN_KEY } from '../../utils/constants';

class MockSignalService {
  updateEmail$ = jasmine.createSpy('updateEmail$');
  updateIsAuthenticated$ = jasmine.createSpy('updateIsAuthenticated$');
}

describe('SessionManagementService', () => {
  let sessionManagementService: SessionManagementService;
  let signalService: SignalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        SessionManagementService,
        { provide: SignalService, useClass: MockSignalService }
      ]
    });

    sessionManagementService = TestBed.inject(SessionManagementService);
    signalService = TestBed.inject(SignalService);
    spyOn(sessionStorage, 'setItem');
    spyOn(sessionStorage, 'removeItem');
  });

  describe('getSession', () => {
    it('should return session data if it exists', () => {
      const mockSessionData = { email: 'user@example.com', token: 'fake-token' };
      spyOn(sessionStorage, 'getItem').and.returnValue(JSON.stringify(mockSessionData));
      const result = sessionManagementService.getSession();
      expect(result).toEqual(mockSessionData);
      expect(sessionStorage.getItem).toHaveBeenCalledWith(TOKEN_KEY);
    });

    it('should return null if session data does not exist', () => {
      spyOn(sessionStorage, 'getItem').and.returnValue(null);
      const result = sessionManagementService.getSession();
      expect(result).toBeNull();
      expect(sessionStorage.getItem).toHaveBeenCalledWith(TOKEN_KEY);
    });
  });

  describe('setSession', () => {
    it('should set session data and update signal service', () => {
      const mockSessionData = { email: 'user@example.com', token: 'fake-token' };
      sessionManagementService.setSession(mockSessionData);
      expect(sessionStorage.setItem).toHaveBeenCalledWith(TOKEN_KEY, JSON.stringify(mockSessionData));
      expect(signalService.updateEmail$).toHaveBeenCalledWith(mockSessionData.email);
      expect(signalService.updateIsAuthenticated$).toHaveBeenCalledWith(true);
    });
  });

  describe('endSession', () => {
    it('should remove session data and update signal service', () => {
      sessionManagementService.endSession();
      expect(sessionStorage.removeItem).toHaveBeenCalledWith(TOKEN_KEY);
      expect(signalService.updateIsAuthenticated$).toHaveBeenCalledWith(false);
      expect(signalService.updateEmail$).toHaveBeenCalledWith(null);
    });
  });
});


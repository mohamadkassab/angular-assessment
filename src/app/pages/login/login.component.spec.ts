import { TestBed, ComponentFixture } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { AuthService } from '../../services/auth/auth.service';
import { SignalService } from '../../services/signal/signal.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

class MockAuthService {
  signIn(email: string, password: string) {
    return Promise.resolve(true);
  }
}

class MockSignalService {}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: SignalService, useClass: MockSignalService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have a form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTruthy();
    expect(component.loginForm.contains('password')).toBeTruthy();
  });

  it('should call authService.signIn when form is submitted and valid', async () => {
    spyOn(authService, 'signIn').and.callThrough();
    component.loginForm.setValue({ email: 'test@example.com', password: 'password' });
    await component.onSubmit(new MouseEvent('click'));
    expect(authService.signIn).toHaveBeenCalledWith('test@example.com', 'password');
  });

  it('should not call authService.signIn when form is invalid', async () => {
    spyOn(authService, 'signIn').and.callThrough();
    component.loginForm.setValue({ email: '', password: 'password' });
    await component.onSubmit(new MouseEvent('click'));
    expect(authService.signIn).not.toHaveBeenCalled();
  });
});

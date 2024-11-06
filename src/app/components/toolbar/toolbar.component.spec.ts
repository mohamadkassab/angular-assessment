import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ToolbarBasic } from './toolbar.component';
import { AuthService } from '../../services/auth/auth.service';
import { SignalService } from '../../services/signal/signal.service';


describe('ToolbarBasic', () => {
  let component: ToolbarBasic;
  let fixture: ComponentFixture<ToolbarBasic>;
  let authService: AuthService;
  let signalService: SignalService;

  beforeEach(async () => {
    authService = jasmine.createSpyObj('AuthService', ['signOut']);
    signalService = jasmine.createSpyObj('SignalService', ['_currentPage', 'updateCurrentPage$']);

    await TestBed.configureTestingModule({

      imports: [
        ToolbarBasic, 
      ],
      providers: [
        { provide: AuthService, useValue: authService },
        { provide: SignalService, useValue: signalService }
      ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ToolbarBasic);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load WeatherComponent when loadComponent is called with WEATHER', () => {
    component.loadComponent('Weather');
    expect(signalService.updateCurrentPage$).toHaveBeenCalledWith('Weather');
  });

  it('should load MyStoreComponent when loadComponent is called with MyStore', () => {
    component.loadComponent('MyStore');
    expect(signalService.updateCurrentPage$).toHaveBeenCalledWith('MyStore');
  });

  it('should call signOut on AuthService when signOut is called', async () => {
    await component.signOut();
    expect(authService.signOut).toHaveBeenCalled();
  });
});

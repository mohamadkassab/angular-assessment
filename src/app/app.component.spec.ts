import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { SignalService } from './services/signal/signal.service';
import { RouterOutlet } from '@angular/router';
import { LoadingComponent } from './components/loading/loading.component';
import { ErrorComponent } from './components/error/error.component';
import { CommonModule } from '@angular/common';
import { StatusModel } from './models/status.model';

class MockSignalService {
  _status = jasmine.createSpy().and.returnValue(StatusModel.LOADING);
  _currentPage = jasmine.createSpy().and.returnValue('home');
  _errorMessages = jasmine.createSpy().and.returnValue([]);
  popErrorMessage = jasmine.createSpy().and.returnValue(undefined);
  pushErrorMessage = jasmine.createSpy().and.callFake((message: string) => {
    this._errorMessages.and.returnValue([...(this._errorMessages() || []), message]);
  });
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let signalService: MockSignalService;

  beforeEach(async () => {
    signalService = new MockSignalService();

    await TestBed.configureTestingModule({
      imports: [RouterOutlet, LoadingComponent, CommonModule, ErrorComponent],
      providers: [{ provide: SignalService, useValue: signalService }]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have title "angular-assessment"', () => {
    expect(component.title).toEqual('angular-assessment');
  });

  it('should set isLoading to true when status is LOADING', () => {
    signalService._status.and.returnValue(StatusModel.LOADING);
    fixture.detectChanges();
    expect(component.isLoading).toBeTrue();
  });

  it('should add error message to errorMessages array', () => {
    signalService.pushErrorMessage('Error 1');
    const errors = signalService._errorMessages(); 
    expect(errors.length).toBe(1);
    expect(errors[0]).toBe('Error 1');
  });

  it('should remove error message from errorMessages array after dismiss', () => {
    component.errorMessages = ['Error 1'];
    component.dismissError('Error 1');
    expect(component.errorMessages.length).toBe(0);
  });
});

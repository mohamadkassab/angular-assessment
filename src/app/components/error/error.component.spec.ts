import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ErrorComponent } from './error.component';
import { By } from '@angular/platform-browser';

describe('ErrorComponent', () => {
  let component: ErrorComponent;
  let fixture: ComponentFixture<ErrorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ErrorComponent]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the error message', () => {
    component.errorMessage = 'Test error message';
    fixture.detectChanges();
    const errorContent = fixture.debugElement.query(By.css('.error-content p'));
    expect(errorContent.nativeElement.textContent).toContain('Test error message');
  });

  it('should emit dismiss event on button click', () => {
    spyOn(component.dismiss, 'emit');
    const button = fixture.debugElement.query(By.css('.dismiss-btn'));
    button.triggerEventHandler('click', null);
    fixture.detectChanges();
    expect(component.dismiss.emit).toHaveBeenCalled();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormFieldComponent } from './form-field.component';
import { ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { By } from '@angular/platform-browser';

describe('FormFieldComponent', () => {
  let component: FormFieldComponent;
  let fixture: ComponentFixture<FormFieldComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ReactiveFormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatIconModule,
        BrowserAnimationsModule,
        FormFieldComponent 
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(FormFieldComponent);
    component = fixture.componentInstance;
    component.label = 'Test Label';
    component.type = 'password';
    component.placeholder = 'Enter value';
    component.control = new FormControl('', { validators: [] });
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the label and placeholder', () => {
    const labelElement = fixture.debugElement.query(By.css('mat-label'));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(labelElement.nativeElement.textContent).toContain('Test Label');
    expect(inputElement.placeholder).toBe('Enter value');
  });

  it('should toggle password visibility', () => {
    const button = fixture.debugElement.query(By.css('button'));
    const inputElement = fixture.debugElement.query(By.css('input')).nativeElement;
    expect(inputElement.type).toBe('password');
    button.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    expect(inputElement.type).toBe('text');
    button.triggerEventHandler('click', new MouseEvent('click'));
    fixture.detectChanges();
    expect(inputElement.type).toBe('password');
  });

  it('should display required error message', () => {
    component.control.setValidators([Validators.required]);
    component.control.updateValueAndValidity();
    component.control.markAsTouched();
    fixture.detectChanges();
    expect(component.getErrorMessage()).toBe('Test Label is required');
  });

  it('should display email error message', () => {
    component.control.setValidators([Validators.email]);
    component.control.setValue('invalid-email');
    component.control.markAsTouched();
    fixture.detectChanges();
    expect(component.getErrorMessage()).toBe('Please enter a valid email');
  });
});

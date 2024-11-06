import { Component, OnInit, Inject, PLATFORM_ID, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldComponent } from '../../components/form-field/form-field.component';
import { AuthService } from '../../services/auth/auth.service';
import { initializeApp } from 'firebase/app';
import { environment } from '../../../environments/environment.dev';
import { SignalService } from '../../services/signal/signal.service';
import { MatIcon } from '@angular/material/icon';
import { StatusModel } from '../../models/status.model';

const app = initializeApp(environment.firebase);

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormFieldComponent,
    MatIcon
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private signalService: SignalService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  async onSubmit(event: MouseEvent) {

      if (this.loginForm.valid) {
        const email = this.loginForm.value.email;
        const password = this.loginForm.value.password;
        await this.authService.signIn(email, password);
      }
    }
    
  

  getErrorMessage(controlName: string): string {
    const control = this.loginForm.get(controlName);
    if (control?.hasError('required')) {
      return `${controlName.charAt(0).toUpperCase() + controlName.slice(1)} is required.`;
    }
    if (control?.hasError('email')) {
      return 'Invalid email format.';
    }
    return '';
  }
}

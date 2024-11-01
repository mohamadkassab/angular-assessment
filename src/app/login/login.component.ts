import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldComponent } from '../components/form-field/form-field.component';
import { AuthService } from '../services/auth/auth.service';
import { getAuth, signInWithEmailAndPassword,signOut } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { StateService } from '../services/app-state/app-state.service';
import { Router } from '@angular/router';
import { TOKEN_NAME } from '../utils/constants';
import { jwtDecode } from 'jwt-decode';
import { isPlatformBrowser } from '@angular/common';  

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
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private router: Router,
    private authService: AuthService,
    @Inject(PLATFORM_ID) private platformId: Object  
  ) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    if (isPlatformBrowser(this.platformId)) {
      const token = localStorage.getItem(TOKEN_NAME);
      if (token) {
        try {

          const decoded: any = jwtDecode(token);
          const isExpired = decoded.exp * 1000 < Date.now(); 

          if (!isExpired) {
            this.router.navigate(['/home']);
          } else {
            console.log('Token is expired');
          }
        } catch (error) {
          console.error('Error decoding token:', error);
        }
      }
    }
  }

  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email; 
      const password = this.loginForm.value.password;

      try {
        await this.authService.signIn(email, password);
      } catch (error) {
        console.error('Error during sign-in:', error);
      }
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

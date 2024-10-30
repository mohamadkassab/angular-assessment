import { Component, OnInit, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldComponent } from '../components/form-field/form-field.component';

import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';
import { StateService } from '../app-state.service';
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
  private auth = getAuth(app);
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private stateService: StateService,
    private router: Router,
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

  onSubmit() {
    try {
      if (this.loginForm.valid) {
        const email = this.loginForm.value.email; 
        const password = this.loginForm.value.password;
        signInWithEmailAndPassword(this.auth, email, password)
          .then(async (userCredential) => {
            const user = userCredential.user;
            if (user.email) {
              this.stateService.updateEmail(user.email);
              this.stateService.updateIsAuthenticated(true);
              const token = await user.getIdToken();  
              localStorage.setItem(TOKEN_NAME, token);
              this.router.navigate(['/home']);
            }
          })
          .catch((error) => {
            console.error('Sign-in error:', error);
          });
      }
    } catch (e) {
      console.log(e);
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

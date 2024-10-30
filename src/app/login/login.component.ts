import { Component, OnInit  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, FormControl  } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormFieldComponent } from '../components/form-field/form-field.component';

import { getAuth, signInWithPopup, GoogleAuthProvider, signOut, signInWithEmailAndPassword } from 'firebase/auth';
import { initializeApp } from 'firebase/app';
import { environment } from '../../environments/environment';


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
  styleUrl: './login.component.css'
})


export class LoginComponent  implements OnInit {
  private auth = getAuth(app);
  loginForm!: FormGroup;

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  // Helper function to cast AbstractControl to FormControl
  get emailControl(): FormControl {
    return this.loginForm.get('email') as FormControl;
  }

  get passwordControl(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const email = this.loginForm.value.email; 
      const password = this.loginForm.value.password; 
      signInWithEmailAndPassword(this.auth,email ,password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log('User signed in:', user);
      })
      .catch((error) => {
        console.error('Sign-in error:', error);
      });
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
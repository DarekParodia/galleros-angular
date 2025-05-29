import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  private readonly usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  private readonly passwordRegex = /^.{6,20}$/;

  constructor(
    private fb: FormBuilder,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if already logged in
    this.auth.isLoggedIn$.subscribe(isLoggedIn => {
      if (isLoggedIn) {
        this.router.navigate(['/']);
      }
    });

    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(this.usernameRegex)]],
      password: ['', [Validators.required, Validators.pattern(this.passwordRegex)]]
    });
  }

  getUsernameError(): string {
    const control = this.loginForm.get('username');
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Username is required';
      }
      if (control.errors['pattern']) {
        return 'Invalid username format';
      }
    }
    return '';
  }

  getPasswordError(): string {
    const control = this.loginForm.get('password');
    if (control?.errors) {
      if (control.errors['required']) {
        return 'Password is required';
      }
      if (control.errors['pattern']) {
        return 'Invalid password format';
      }
    }
    return '';
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      
      this.auth.login(username, password).subscribe({
        next: (response) => {
          if (response.body?.error) {
            this.loginForm.setErrors({ serverError: response.body.error });
            return;
          }
          this.router.navigate(['/']);
        },
        error: (error) => {
          console.error('Login failed:', error);
          this.loginForm.setErrors({ serverError: 'Login failed. Please try again later.' });
        }
      });
    }
  }
}

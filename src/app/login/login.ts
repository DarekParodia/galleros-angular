import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

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
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    // Check if already logged in
    if (localStorage.getItem('logged_in') === 'true') {
      this.router.navigate(['/']);
      return;
    }

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
      
      this.http.post<any>('http://localhost:80/galleros/public/api/auth.php', {
        name: username,
        password: password
      }).subscribe({
        next: (response) => {
          if (response.error) {
            this.loginForm.setErrors({ serverError: response.error });
            return;
          }
          localStorage.setItem('logged_in', 'true');
          localStorage.setItem('username', username);
          localStorage.setItem('user_id', response.id);
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

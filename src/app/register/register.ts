import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.html',
  styleUrls: ['./register.scss'],
  imports: [CommonModule, ReactiveFormsModule]
})
export class Register implements OnInit {
  registerForm: FormGroup;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
    this.registerForm = this.fb.group({
      username: ['', [Validators.required, Validators.pattern(/^[a-zA-Z0-9_]{3,20}$/)]],
      password: ['', [Validators.required, Validators.pattern(/^.{6,20}$/)]],
      confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });
  }

  ngOnInit(): void {}

  passwordMatchValidator(form: FormGroup): { mismatch: boolean } | null {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  onSubmit(): void {
    if (this.registerForm.valid) {
      const { username, password } = this.registerForm.value;
      this.authService.register(username, password).subscribe({
        next: () => this.router.navigate(['/login']),
        error: (err: any) => {
          console.error('Registration failed:', err);
          if (err.error.includes('Duplicate entry')) {
            this.registerForm.get('username')?.setErrors({ duplicate: true });
          }
        }
      });
    }
  }
}

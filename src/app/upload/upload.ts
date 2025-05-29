import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './upload.html',
  styleUrl: './upload.scss'
})
export class Upload implements OnInit {
  uploadForm!: FormGroup;
  error: string | null = null;
  isUploading = false;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    // Check if user is logged in
    this.auth.isLoggedIn$.subscribe(isLoggedIn => {
      if (!isLoggedIn) {
        this.router.navigate(['/login']);
      }
    });

    this.uploadForm = this.fb.group({
      title: ['', [Validators.required]],
      thumbnail: [null, [Validators.required]]
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    this.uploadForm.patchValue({ thumbnail: file });
    this.uploadForm.get('thumbnail')?.updateValueAndValidity();
  }

  onSubmit() {
    if (this.uploadForm.valid) {
      this.isUploading = true;
      const formData = new FormData();
      formData.append('title', this.uploadForm.get('title')?.value);
      formData.append('thumbnail', this.uploadForm.get('thumbnail')?.value);
      formData.append('type', 'gallery');

      this.http.post(
        'http://localhost:80/galleros/public/api/upload.php', 
        formData,
        { withCredentials: true } // Enable sending cookies with the request
      ).subscribe({
        next: (response: any) => {
          if (response.error) {
            this.error = response.error;
            this.isUploading = false;
            return;
          }
          this.router.navigate(['/']);
        },
        error: (err) => {
          console.error('Upload failed:', err);
          this.error = 'Upload failed. Please try again later.';
          this.isUploading = false;
        }
      });
    }
  }
}

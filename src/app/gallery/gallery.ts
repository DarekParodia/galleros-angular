import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.html',
  styleUrls: ['./gallery.scss'],
  imports: [CommonModule]
})
export class Gallery implements OnInit {
  galleryId: string | null = null;
  gallery: any = null;
  posts: any[] = [];
  showUploadSection: boolean = false;

  constructor(private http: HttpClient, private cookieService: CookieService) {}

  ngOnInit(): void {
    const urlParams = new URLSearchParams(window.location.search);
    this.galleryId = urlParams.get('id');

    if (!this.galleryId) {
      this.redirectHome();
      return;
    }

    this.loadGallery();
  }

  redirectHome(): void {
    window.location.href = './';
  }

  loadGallery(): void {
    this.http.get(`./api/gallery.php?id=${this.galleryId}`).subscribe(
      (response: any) => {
        if (!response || response.error) {
          this.redirectHome();
          return;
        }

        this.gallery = response;
        this.updateGalleryHeader();
        this.loadPosts();
      },
      (error) => {
        console.error('Error loading gallery:', error);
        this.redirectHome();
      }
    );
  }

  updateGalleryHeader(): void {
    document.title = `${this.gallery.name} - Galleros`;
    const currentUserId = this.cookieService.get('user_id');
    this.showUploadSection = !!currentUserId && currentUserId === this.gallery.author.id.toString();
  }

  loadPosts(): void {
    this.http.get(`./api/post.php?gallery=${this.galleryId}`).subscribe(
      (response: any) => {
        if (!response || response.error) {
          this.posts = [];
          return;
        }

        this.posts = response;
      },
      (error) => {
        console.error('Error loading posts:', error);
      }
    );
  }

  createPost(formData: FormData): void {
    this.http.post('./api/upload.php', formData).subscribe(
      (response: any) => {
        if (response && !response.error) {
          this.loadPosts();
        } else {
          alert('Failed to create post: ' + (response.error || 'Unknown error'));
        }
      },
      (error) => {
        console.error('Error creating post:', error);
        alert('Error creating post: ' + error);
      }
    );
  }
}

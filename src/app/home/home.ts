import { Component } from '@angular/core';
import { GalleryCell } from '../gallery-cell/gallery-cell';
import { HttpClient } from '@angular/common/http';
import { Gallery, GalleryData } from '../types';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [GalleryCell],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  galleries: Gallery[] = [];
  loading = true;

  constructor(private http: HttpClient) {
    console.log('Home component initialized');
    
    this.http.get<GalleryData[]>('http://localhost:80/galleros/public/api/gallery.php').subscribe({
      next: (data) => {
        console.log('Raw data:', data);
        this.galleries = data.map(galleryData => new Gallery(galleryData));
        console.log('Mapped galleries:', this.galleries);
        this.loading = false;
      },
      error: (err) => {
        console.error('Failed to load galleries', err);
        this.loading = false;
      }
    });
  }

  // galleryItems = [
  //   {
  //     id: 1,
  //     title: 'Sample Image 1',
  //     author: 'John Doe',
  //     imageUrl: 'https://picsum.photos/400/250'
  //   },
  //   {
  //     id: 2,
  //     title: 'Sample Image 2',
  //     author: 'Jane Smith',
  //     imageUrl: 'https://picsum.photos/400/250'
  //   },
  //   // Add more sample items as needed
  // ];
}

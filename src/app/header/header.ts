import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.scss'
})
export class Header implements OnInit {
  isCollapsed = true;
  isLoggedIn = false;
  username: string | null = null;

  constructor(
    private router: Router,
    private auth: AuthService
  ) {}

  ngOnInit() {
    this.auth.isLoggedIn$.subscribe(
      isLoggedIn => this.isLoggedIn = isLoggedIn
    );
    this.auth.username$.subscribe(
      username => this.username = username
    );
  }

  logout() {
    this.auth.logout().subscribe({
      next: () => {
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Logout failed:', error);
        // Still clear local session even if server request fails
        this.auth.logout().subscribe();
      }
    });
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }
}

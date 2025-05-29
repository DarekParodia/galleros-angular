import { Component, OnInit } from '@angular/core';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { CommonModule } from '@angular/common';

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

  constructor(private router: Router) {}

  ngOnInit() {
    this.checkAuthStatus();
  }

  private checkAuthStatus() {
    this.isLoggedIn = localStorage.getItem('logged_in') === 'true';
    this.username = localStorage.getItem('username');
  }

  logout() {
    // Clear all localStorage items
    localStorage.removeItem('logged_in');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    
    // Reset component state
    this.isLoggedIn = false;
    this.username = null;
    
    // Navigate to home
    this.router.navigate(['/']);
  }

  toggleNavbar() {
    this.isCollapsed = !this.isCollapsed;
  }
}

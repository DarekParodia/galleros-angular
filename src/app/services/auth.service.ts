import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly API_URL = 'http://localhost:80/galleros/public/api';
  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasValidSession());
  private usernameSubject = new BehaviorSubject<string | null>(localStorage.getItem('username'));
  private userIdSubject = new BehaviorSubject<string | null>(localStorage.getItem('user_id'));

  isLoggedIn$ = this.isLoggedInSubject.asObservable();
  username$ = this.usernameSubject.asObservable();
  userId$ = this.userIdSubject.asObservable();

  constructor(private http: HttpClient) {}

  login(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/auth.php`, {
      name: username,
      password: password
    }, { observe: 'response', withCredentials: true }).pipe(
      tap((response: HttpResponse<any>) => {
        if (response.body && !response.body.error) {
          this.setSession(response.body.id, username);
        }
      })
    );
  }

  logout(): Observable<any> {
    return this.http.get(`${this.API_URL}/logout.php`, { withCredentials: true }).pipe(
      tap(() => {
        this.clearSession();
      })
    );
  }

  register(username: string, password: string): Observable<any> {
    return this.http.post<any>(`${this.API_URL}/user.php`, {
      name: username,
      password: password
    }, { observe: 'response', withCredentials: true });
  }

  private setSession(userId: string, username: string) {
    localStorage.setItem('logged_in', 'true');
    localStorage.setItem('username', username);
    localStorage.setItem('user_id', userId);
    this.isLoggedInSubject.next(true);
    this.usernameSubject.next(username);
    this.userIdSubject.next(userId);
  }

  private clearSession() {
    localStorage.removeItem('logged_in');
    localStorage.removeItem('username');
    localStorage.removeItem('user_id');
    this.isLoggedInSubject.next(false);
    this.usernameSubject.next(null);
    this.userIdSubject.next(null);
  }

  private hasValidSession(): boolean {
    return localStorage.getItem('logged_in') === 'true';
  }
}
import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

export interface UserData {
  id: number | string;
  nombre: string;
  email: string;
  rol?: string;
  [key: string]: unknown; // Cambiado de 'any' a 'unknown' para satisfacer a ESLint
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private platformId = inject(PLATFORM_ID);

  private isLoggedInSubject = new BehaviorSubject<boolean>(this.hasToken());
  public isLoggedIn$ = this.isLoggedInSubject.asObservable();

  private hasToken(): boolean {
    if (isPlatformBrowser(this.platformId)) {
      return !!localStorage.getItem('loggedInUser');
    }
    return false;
  }

  login(userData: UserData, token: string): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem('loggedInUser', JSON.stringify(userData));
      localStorage.setItem('tu_token', token);
    }
    this.isLoggedInSubject.next(true);
  }

  logout(): void {
    if (isPlatformBrowser(this.platformId)) {
      localStorage.removeItem('loggedInUser');
      localStorage.removeItem('tu_token');
    }
    this.isLoggedInSubject.next(false);
  }
}

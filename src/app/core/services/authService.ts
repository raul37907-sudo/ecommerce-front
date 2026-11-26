/*  ----- authService.ts  dir: src/app/core/services/ authService.ts  */
import { Injectable, inject, PLATFORM_ID, NgZone } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

export interface UserData {
  id?: number | string;
  nombre?: string;
  email: string;
  rol?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private platformId = inject(PLATFORM_ID);
  private ngZone = inject(NgZone);

  private readonly apiUrl = 'http://localhost:8080/api/auth';
  private readonly userStorageKey = 'loggedInUser';
  private readonly tokenStorageKey = 'token';
  private readonly lastActivityKey = 'lastActivityAt';
  private readonly inactivityTimeoutMs = 2 * 60 * 1000; // 2 minutos

  private inactivityTimer: ReturnType<typeof setTimeout> | null = null;
  private activityListenersBound = false;

  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor() {
    this.initSessionState();
  }

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  private initSessionState(): void {
    if (!this.isBrowser()) {
      this.isLoggedInSubject.next(false);
      return;
    }

    const hasUser = Boolean(localStorage.getItem(this.userStorageKey));
    if (!hasUser) {
      this.isLoggedInSubject.next(false);
      return;
    }

    const lastActivityRaw = localStorage.getItem(this.lastActivityKey);
    const lastActivity = lastActivityRaw ? Number(lastActivityRaw) : 0;
    const elapsed = Date.now() - lastActivity;

    if (!lastActivity || elapsed >= this.inactivityTimeoutMs) {
      this.logout();
      return;
    }

    this.isLoggedInSubject.next(true);
    this.bindActivityListeners();
    this.resetInactivityTimer(this.inactivityTimeoutMs - elapsed);
  }

  private bindActivityListeners(): void {
    if (!this.isBrowser() || this.activityListenersBound) {
      return;
    }

    this.activityListenersBound = true;
    const events: (keyof WindowEventMap)[] = [
      'mousemove',
      'mousedown',
      'keydown',
      'scroll',
      'touchstart'
    ];

    this.ngZone.runOutsideAngular(() => {
      events.forEach((eventName) => {
        window.addEventListener(eventName, this.handleUserActivity, { passive: true });
      });
    });
  }

  private handleUserActivity = (): void => {
    if (!this.isLoggedInSubject.value || !this.isBrowser()) {
      return;
    }
    localStorage.setItem(this.lastActivityKey, String(Date.now()));
    this.resetInactivityTimer(this.inactivityTimeoutMs);
  };

  private resetInactivityTimer(delayMs: number = this.inactivityTimeoutMs): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }

    if (!this.isLoggedInSubject.value) {
      return;
    }

    this.inactivityTimer = setTimeout(() => {
      this.ngZone.run(() => {
        this.logout();
      });
    }, delayMs);
  }

  get isLoggedIn(): boolean {
    return this.isLoggedInSubject.value;
  }

  getCurrentUser(): UserData | null {
    if (!this.isBrowser()) {
      return null;
    }
    try {
      const raw = localStorage.getItem(this.userStorageKey);
      return raw ? (JSON.parse(raw) as UserData) : null;
    } catch {
      return null;
    }
  }

  login(userData: UserData, token: string): void {
    if (this.isBrowser()) {
      localStorage.setItem(this.userStorageKey, JSON.stringify(userData));
      localStorage.setItem(this.tokenStorageKey, token);
      localStorage.setItem(this.lastActivityKey, String(Date.now()));
    }
    this.isLoggedInSubject.next(true);
    this.bindActivityListeners();
    this.resetInactivityTimer(this.inactivityTimeoutMs);
  }

  logout(): void {
    if (this.inactivityTimer) {
      clearTimeout(this.inactivityTimer);
      this.inactivityTimer = null;
    }
    if (this.isBrowser()) {
      localStorage.removeItem(this.userStorageKey);
      localStorage.removeItem(this.tokenStorageKey);
      localStorage.removeItem(this.lastActivityKey);
    }
    this.isLoggedInSubject.next(false);
  }

  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email });
  }

  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
}

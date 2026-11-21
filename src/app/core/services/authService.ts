import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = 'http://localhost:8080/api/auth'; // Ajusta la URL de tu backend

  constructor(private http: HttpClient) {}

  /**
   * Envía la solicitud para generar el token/enlace de recuperación.
   */
  requestPasswordReset(email: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/forgot-password`, { email });
  }

  /**
   * Envía el token y la nueva contraseña para completar el restablecimiento.
   */
  resetPassword(token: string, newPassword: string): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/reset-password`, { token, newPassword });
  }
}

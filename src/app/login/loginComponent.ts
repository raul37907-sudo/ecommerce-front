import { Component, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { ModalRegistroComponent } from './modal-registro.component';
import { AuthService } from '../auth.service'; // <--- Importa tu servicio

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    ModalRegistroComponent
  ],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class LoginComponent {
  private router = inject(Router);
  private platformId = inject(PLATFORM_ID);
  private authService = inject(AuthService); // <--- Inyecta el servicio

  onClose(): void {
    this.router.navigate(['/dashboard']);
  }

  isRegisterModalOpen: boolean = false;

  openRegisterModal(): void {
    this.isRegisterModalOpen = true;
  }

  closeRegisterModal(): void {
    this.isRegisterModalOpen = false;
  }

  hidePassword = true;

  user = {
    email: '',
    password: ''
  };

  storedUser = {
    email: 'test@gmail.com',
    password: 'pass1234'
  };

  loginValid: boolean = true;

  isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validateLogin(email: string, password: string): boolean {
    return email === this.storedUser.email && password === this.storedUser.password;
  }

  login(): void {
    if (!this.isValidEmailFormat(this.user.email)) {
      this.loginValid = false;
      return;
    }

    if (this.validateLogin(this.user.email, this.user.password)) {
      this.loginValid = true;

      // Usa el método del servicio para guardar la sesión y notificar al Dashboard
      this.authService.login({ email: this.user.email }, 'token_falso_abc123');

      this.router.navigate(['/dashboard']);
    } else {
      this.loginValid = false;
    }
  }
}

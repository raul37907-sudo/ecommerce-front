/*-- -----dir: src/app/login/loginComponent.ts  */
import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router, RouterLink } from '@angular/router';
import { ModalRegistroComponent } from './modal-registro.component';
import { AuthService } from '../core/services/authService';

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
    ModalRegistroComponent,
    RouterLink
  ],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class LoginComponent {
  private router = inject(Router);
  private authService = inject(AuthService);

  onClose(): void {
    this.router.navigate(['/dashboard']);
  }

  isRegisterModalOpen = false;

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
    password: '1234'
  };

  loginValid = true;

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

      const dynamicUserData = {
        id: new Date().getTime(),
        nombre: this.user.email.split('@')[0],
        email: this.user.email,
        rol: 'CLIENTE'
      };

      this.authService.login(dynamicUserData, 'token_falso_abc123');
      this.router.navigate(['/dashboard']);
    } else {
      this.loginValid = false;
    }
  }
}

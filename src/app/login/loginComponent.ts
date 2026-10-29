import { Component, inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { ModalRegistroComponent } from './modal-registro.component';
import { AuthService } from '../auth.service';

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
    password: 'pass1234'
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

      // DINÁMICO: Construimos el objeto UserData usando los datos reales ingresados
      const dynamicUserData = {
        id: new Date().getTime(), // ID único temporal basado en tiempo (o el que te devuelva tu API)
        nombre: this.user.email.split('@')[0], // Extrae un nombre base del correo, o puedes agregar un campo de nombre en el login si lo deseas
        email: this.user.email,
        rol: 'CLIENTE'
      };

      // Guardamos la sesión con los datos reales del usuario
      this.authService.login(dynamicUserData, 'token_falso_abc123');

      this.router.navigate(['/dashboard']);
    } else {
      this.loginValid = false;
    }
  }
}

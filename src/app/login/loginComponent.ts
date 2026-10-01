import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';

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
    MatFormFieldModule
  ],
  styleUrl: './login.css',
  templateUrl: './login.html',
})
export class LoginComponent {
  router = inject(Router);

  // Control de visibilidad de la contraseña
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

  // Método para comprobar si la cadena cumple con el formato estándar de email
  isValidEmailFormat(email: string): boolean {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  }

  validateLogin(email: string, password: string): boolean {
    return email === this.storedUser.email && password === this.storedUser.password;
  }

  login(): void {
    // 1. Verifica formato de email
    if (!this.isValidEmailFormat(this.user.email)) {
      this.loginValid = false;
      return;
    }

    // 2. Compara credenciales
    if (this.validateLogin(this.user.email, this.user.password)) {
      localStorage.setItem('loggedInUser', JSON.stringify(this.user.email));
      this.loginValid = true;
      this.router.navigate(['/dashboard']);
    } else {
      this.loginValid = false;
    }
  }
}

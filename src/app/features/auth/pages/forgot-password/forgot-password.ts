import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { AuthService } from '../../../../core/services/authService'; // Ajusta los niveles según tu estructura exacta

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forgot-password.html',
  styleUrls: ['./forgot-password.css']
})
export class ForgotPassword {
  forgotForm: FormGroup;
  loading = false;
  successMessage = '';
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.forgotForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotForm.invalid) {
      this.forgotForm.markAllAsTouched();
      return;
    }

    this.loading = true;
    this.successMessage = '';
    this.errorMessage = '';

    const email = this.forgotForm.value.email;

    this.authService.requestPasswordReset(email).subscribe({
      next: () => {
        this.loading = false;
        this.successMessage = 'Hemos enviado un enlace de recuperación a tu correo electrónico.';
        this.forgotForm.reset();
      },
      error: (err: any) => { // Tipado explícito para evitar el error TS7006
        this.loading = false;
        this.errorMessage = err.error?.message || 'Ocurrió un error al procesar la solicitud.';
      }
    });
  }
}

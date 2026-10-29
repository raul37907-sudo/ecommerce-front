import { Component, Output, EventEmitter, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-modal-registro',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './modal-registro.component.html',
  styleUrl: './modal-registro.component.css'
})
export class ModalRegistroComponent implements OnInit {
  // Inyección moderna con inject()
  private fb = inject(FormBuilder);

  @Output() closeModal = new EventEmitter<void>();

  registroForm!: FormGroup;

  showPassword = {
    main: false,
    confirm: false
  };

  allowedDomains: string[] = ['gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'miempresa.com'];

  ngOnInit(): void {
    this.registroForm = this.fb.group({
      name: ['', [Validators.required, Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$|/)]],
      email: ['', [Validators.required, Validators.email, this.domainValidator.bind(this)]],
      direccion: ['', [Validators.required]],
      fechaNacimiento: ['', [Validators.required, this.adultValidator]],
      phoneNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],

      // Ajustado a minLength(8) para coincidir con tu interfaz
      password: ['', [Validators.required, Validators.minLength(8)]],
      confirmaPass: ['', [Validators.required]],
      acceptTerms: [false, [Validators.requiredTrue]]
    }, {
      validators: this.passwordsMatchValidator
    });
  }

  // Permite alternar la visibilidad de los campos de contraseña
  togglePasswordVisibility(field: 'main' | 'confirm'): void {
    this.showPassword[field] = !this.showPassword[field];
  }

  // Previene teclear caracteres que no sean números en el teléfono
  onlyNumbers(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }

  // --- VALIDADORES PERSONALIZADOS ---

  private domainValidator(control: AbstractControl): ValidationErrors | null {
    const email = control.value;
    if (!email) return null;

    const domain = email.split('@')[1]?.toLowerCase();
    if (domain && !this.allowedDomains.includes(domain)) {
      return { invalidDomain: true };
    }
    return null;
  }

  private adultValidator(control: AbstractControl): ValidationErrors | null {
    if (!control.value) return null;

    const birthDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (birthDate > today) {
      return { futureDate: true };
    }

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();

    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }

    if (age < 18) {
      return { underage: true };
    }

    return null;
  }

  private passwordsMatchValidator(group: AbstractControl): ValidationErrors | null {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmaPass')?.value;

    if (pass && confirmPass && pass !== confirmPass) {
      group.get('confirmaPass')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  get maxDate(): string {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  onClose(): void {
    this.closeModal.emit();
  }

  onRegister(): void {
    if (this.registroForm.invalid) {
      this.registroForm.markAllAsTouched();
      return;
    }

    console.log('Datos de registro:', this.registroForm.value);
    this.onClose();
  }
}

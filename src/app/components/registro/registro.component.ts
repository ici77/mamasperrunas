import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { BannerportadaComponent } from '../bannerportada/bannerportada.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, BannerportadaComponent]
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$') // Solo letras y espacios
        ]
      ],
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      password: [
        '',
        [
          Validators.required,
          Validators.minLength(6),
          Validators.maxLength(30),
          Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$') // Al menos una mayúscula, una minúscula y un número
        ]
      ]
    });
  }

 onSubmit(): void {
  if (this.registroForm.valid) {
    const usuario = {
      ...this.registroForm.value,
      fotoPerfil: 'assets/images/default-avatar.png'
    };

    console.log('👀 Enviando al backend:', usuario); // 👈 VERIFICAR AQUÍ
    console.log('Usuario que se va a registrar:', this.registroForm.value);

    this.http.post('http://localhost:8080/api/usuarios/registro', usuario, { responseType: 'json' })
      .subscribe({
        next: (response) => {
          console.log('✅ Usuario registrado:', response);
          this.mensajeExito = 'Registro exitoso. Bienvenida a Mamás Perrunas.';
          this.mensajeError = null;
          this.registroForm.reset();

          setTimeout(() => {
            this.router.navigate(['/inicio']);
          }, 2000);
        },
        error: (err) => {
          console.error('❌ Error en el registro:', err);
          this.mensajeError = err.error?.error || 'Error en el registro. Inténtalo nuevamente.';
          this.mensajeExito = null;
        }
      });
  }
}


  getErrorMessage(campo: string): string {
    const control = this.registroForm.get(campo);
    if (!control || !control.errors) return '';

    if (control.errors['required']) {
      return 'Este campo es obligatorio';
    }

    if (campo === 'nombre') {
      if (control.errors['minlength']) return 'El nombre debe tener al menos 2 caracteres';
      if (control.errors['maxlength']) return 'El nombre no puede superar los 50 caracteres';
      if (control.errors['pattern']) return 'El nombre solo puede contener letras y espacios';
    }

    if (campo === 'email') {
      if (control.errors['email']) return 'Por favor, introduce un email válido';
    }

    if (campo === 'password') {
      if (control.errors['minlength']) return 'La contraseña debe tener al menos 6 caracteres';
      if (control.errors['maxlength']) return 'La contraseña no puede superar los 30 caracteres';
      if (control.errors['pattern']) {
        return 'La contraseña debe tener al menos una mayúscula, una minúscula y un número';
      }
    }

    return '';
  }
}

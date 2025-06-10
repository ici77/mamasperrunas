import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { BannerportadaComponent } from '../bannerportada/bannerportada.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

/**
 * Componente para gestionar el registro de un nuevo usuario en la aplicación.
 * Este formulario incluye validaciones para nombre, email y contraseña.
 * 
 * @component
 * @example
 * <app-registro></app-registro>
 */
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, BannerportadaComponent]
})
export class RegistroComponent {
  /** Formulario reactivo para el registro */
  registroForm: FormGroup;

  /** Mensaje de éxito al registrar el usuario */
  mensajeExito: string | null = null;

  /** Mensaje de error al intentar registrar el usuario */
  mensajeError: string | null = null;

  /**
   * Constructor para inicializar el formulario reactivo, el servicio HTTP y el enrutador.
   * 
   * @param fb - FormBuilder para crear el formulario reactivo
   * @param http - HttpClient para hacer solicitudes HTTP
   * @param router - Router para navegar entre las vistas
   */
  constructor(
    private fb: FormBuilder,
    private http: HttpClient,
    private router: Router
  ) {
    this.registroForm = this.fb.group({
      /** Nombre del usuario, validado para solo aceptar letras y espacios */
      nombre: [
        '',
        [
          Validators.required,
          Validators.minLength(2),
          Validators.maxLength(50),
          Validators.pattern('^[a-zA-ZáéíóúÁÉÍÓÚñÑ ]+$') // Solo letras y espacios
        ]
      ],
      /** Email del usuario, validado como un email válido */
      email: [
        '',
        [
          Validators.required,
          Validators.email
        ]
      ],
      /** Contraseña del usuario, validada para tener al menos una mayúscula, una minúscula y un número */
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

  /**
   * Método que se ejecuta cuando el formulario se envía. Realiza el registro del usuario a través de una solicitud HTTP.
   */
  onSubmit(): void {
    if (this.registroForm.valid) {
      const usuario = {
        ...this.registroForm.value,
        foto_perfil: 'assets/images/default-avatar.png' // ✅ Backend espera snake_case
      };

      console.log('👀 Enviando al backend:', usuario);

      this.http.post(`${environment.apiUrl}/usuarios/registro`, usuario, { responseType: 'json' })
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

  /**
   * Devuelve el mensaje de error correspondiente para un campo específico del formulario.
   * 
   * @param campo - El nombre del campo del formulario para el que se quiere obtener el mensaje de error
   * @returns El mensaje de error del campo
   */
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

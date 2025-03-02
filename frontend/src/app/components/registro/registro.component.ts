import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; 
import { BannerportadaComponent } from '../bannerportada/bannerportada.component';  // Importa el componente correctamente
import { CommonModule } from '@angular/common';

/**
 * 📌 Componente `RegistroComponent`
 *
 * Este componente gestiona el formulario de registro de usuarios. 
 * Permite a los usuarios registrarse proporcionando su nombre, email y contraseña.
 *
 * ℹ️ **Uso:** Se utiliza en la página de registro (`/registro`).
 */
@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, BannerportadaComponent]  // Agrega el componente a los imports
})
export class RegistroComponent {
  /**
   * 📌 Formulario de registro de usuario.
   * Contiene los campos de nombre, email y contraseña con validaciones.
   */
  registroForm: FormGroup;

  /**
   * 📌 Mensaje de éxito cuando el usuario se registra correctamente.
   */
  mensajeExito: string | null = null;

  /**
   * 📌 Mensaje de error cuando ocurre un fallo en el registro.
   */
  mensajeError: string | null = null;

  /**
   * Constructor del componente.
   * @param fb - Servicio `FormBuilder` para crear el formulario reactivo.
   * @param http - Servicio `HttpClient` para enviar la solicitud de registro al backend.
   */
  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * 📌 Método `onSubmit()`
   *
   * - Verifica que el formulario sea válido.
   * - Agrega una imagen de perfil predeterminada al usuario.
   * - Envía los datos del usuario al backend para el registro.
   * - Muestra un mensaje de éxito o error según la respuesta del servidor.
   */
  onSubmit(): void {
    if (this.registroForm.valid) {
      const usuario = {
        ...this.registroForm.value,
        fotoPerfil: 'assets/images/avatar.png' // Imagen predeterminada
      };
  
      // Enviar los datos al backend
      this.http.post('http://localhost:8080/api/usuarios/registro', usuario, { responseType: 'json' })
        .subscribe({
          next: (response) => {
            console.log('✅ Usuario registrado:', response);
            this.mensajeExito = 'Registro exitoso. Ahora puedes iniciar sesión.';
            this.mensajeError = null;
            this.registroForm.reset();
          },
          error: (err) => {
            console.error('❌ Error en el registro:', err);
            this.mensajeError = err.error?.error || 'Error en el registro. Inténtalo nuevamente.';
          }
        });
    }
  }
  
  
  /**
   * 📌 Método `getErrorMessage()`
   *
   * - Devuelve un mensaje de error específico según el campo y su validación.
   *
   * @param campo - Nombre del campo a validar (`nombre`, `email`, `password`).
   * @returns Mensaje de error correspondiente.
   */
  getErrorMessage(campo: string): string {
    const control = this.registroForm.get(campo);
    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (campo === 'email' && control?.hasError('email')) {
      return 'Por favor, introduce un email válido';
    }
    if (campo === 'nombre' && control?.hasError('minlength')) {
      return 'El nombre debe tener al menos 2 caracteres';
    }
    if (campo === 'password' && control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}

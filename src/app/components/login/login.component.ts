import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule, ViewportScroller } from '@angular/common';

/**
 * 📌 Componente `LoginComponent`
 *
 * Este componente gestiona el formulario de inicio de sesión de la plataforma Mamás Perrunas.
 * Realiza validaciones en los campos email y contraseña, y envía los datos al backend utilizando el servicio `AuthService`.
 * En caso de éxito, redirige al usuario a la página principal.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule]
})
export class LoginComponent {

  /**
   * Formulario reactivo que contiene los campos de email y contraseña.
   */
  loginForm: FormGroup;

  /**
   * Mensaje de error mostrado si las credenciales son incorrectas.
   */
  mensajeError: string | null = null;

  /**
   * Constructor que inyecta servicios necesarios y configura el formulario.
   * @param fb Constructor de formularios
   * @param authService Servicio de autenticación
   * @param router Enrutador de Angular para redirigir tras el login
   * @param viewportScroller Utilidad para hacer scroll al inicio tras iniciar sesión
   */
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * Envía los datos del formulario al backend a través de `AuthService`.
   * Si el login es exitoso, redirige a la página principal.
   * Si falla, muestra un mensaje de error.
   */
  onSubmit(): void {
    if (this.loginForm.invalid) {
      this.mostrarErroresFormulario();
      return;
    }

    const { email, password } = this.loginForm.value;

    this.authService.login({ email, password }).subscribe({
      next: () => {
        this.router.navigate(['/']).then(() => {
          this.viewportScroller.scrollToPosition([0, 0]); // Lleva al principio de la página
        });
      },
      error: (err) => {
        console.error('Error en el inicio de sesión:', err);
        this.mensajeError = 'Datos erroneos. Por favor, intenta nuevamente.';
      }
    });
  }

  /**
   * Recorre los campos del formulario y los marca como tocados para mostrar errores de validación.
   */
  private mostrarErroresFormulario(): void {
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  /**
   * Devuelve el mensaje de error correspondiente a un campo específico del formulario.
   * @param campo Nombre del campo del formulario (email o password).
   * @returns Mensaje de error correspondiente si existe.
   */
  getErrorMessage(campo: string): string {
    const control = this.loginForm.get(campo);

    if (control?.hasError('required')) {
      return 'Este campo es obligatorio';
    }
    if (campo === 'email' && control?.hasError('email')) {
      return 'Por favor, introduce un email válido';
    }
    if (campo === 'password' && control?.hasError('minlength')) {
      return 'La contraseña debe tener al menos 6 caracteres';
    }
    return '';
  }
}

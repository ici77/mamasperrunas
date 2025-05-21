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
 * Este componente gestiona el formulario de inicio de sesión, validando los datos ingresados
 * y enviando la petición al backend a través del `AuthService`.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule]
})
export class LoginComponent {
  loginForm: FormGroup;
  mensajeError: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private viewportScroller: ViewportScroller // ✅ scroll al principio
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * 📌 Envía los datos del formulario al backend a través de `AuthService`.
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
          this.viewportScroller.scrollToPosition([0, 0]); // ✅ Lleva al principio de la página
        });
      },
      error: (err) => {
        console.error('Error en el inicio de sesión:', err);
        this.mensajeError = 'Credenciales inválidas. Por favor, intenta nuevamente.';
      }
    });
  }

  /**
   * 📌 Recorre los campos del formulario y marca los errores.
   */
  private mostrarErroresFormulario(): void {
    Object.values(this.loginForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  /**
   * 📌 Devuelve el mensaje de error de un campo del formulario.
   * @param campo - Nombre del campo del formulario (email o password).
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

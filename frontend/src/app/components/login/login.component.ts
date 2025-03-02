import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

/**
 * 📌 Componente `LoginComponent`
 *
 * Este componente gestiona el formulario de inicio de sesión de los usuarios.
 * Se encarga de validar los datos ingresados, realizar la autenticación con el backend
 * y almacenar el token JWT en el navegador.
 *
 * ℹ️ **Uso:** Se utiliza en la página de inicio de sesión dentro de la aplicación.
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
   * 📌 Formulario de inicio de sesión.
   * Contiene los campos de email y contraseña con sus respectivas validaciones.
   */
  loginForm: FormGroup;

  /**
   * 📌 Mensaje de error en caso de que las credenciales sean incorrectas.
   */
  mensajeError: string | null = null;

  /**
   * Constructor del componente.
   * @param fb - Servicio `FormBuilder` para crear el formulario reactivo.
   * @param http - Servicio `HttpClient` para realizar la petición de autenticación.
   * @param router - Servicio `Router` para redirigir al usuario tras el inicio de sesión.
   */
  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  /**
   * 📌 Método que se ejecuta al enviar el formulario.
   *
   * - Verifica que el formulario sea válido.
   * - Envía los datos al backend para autenticar al usuario.
   * - Si el inicio de sesión es exitoso, almacena el token JWT y redirige al perfil del usuario.
   * - Si hay un error, muestra un mensaje indicando que las credenciales son inválidas.
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:8080/api/usuarios/login', this.loginForm.value, { responseType: 'json' }).subscribe({
        next: (response: any) => {
          console.log('Token recibido:', response.token);
          localStorage.setItem('token', response.token);  // Guarda el token en localStorage
          this.router.navigate(['/profile']);  // Redirige al perfil del usuario
        },
        error: (err) => {
          console.error('Error en el inicio de sesión:', err);
          this.mensajeError = 'Credenciales inválidas. Por favor, intenta nuevamente.';
        }
      });
    }
  }

  /**
   * 📌 Método para obtener mensajes de error en los campos del formulario.
   * @param campo - Nombre del campo del formulario (email o password).
   * @returns Mensaje de error correspondiente según la validación que haya fallado.
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

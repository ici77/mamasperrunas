import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';  // Importar Router para la redirección
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { CommonModule } from '@angular/common';

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

  constructor(private fb: FormBuilder, private http: HttpClient, private router: Router) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post('http://localhost:8080/auth/login', this.loginForm.value, { responseType: 'text' }).subscribe({
        next: (token) => {
          console.log('Token recibido:', token);
          localStorage.setItem('token', token);  // Almacenar el token JWT en el localStorage
          this.router.navigate(['/profile']);  // Redirigir al perfil del usuario
        },
        error: (err) => {
          console.error('Error en el inicio de sesión:', err);
          this.mensajeError = 'Credenciales inválidas. Por favor, intenta nuevamente.';
        }
      });
    }
  }

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

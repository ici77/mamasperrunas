import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; 
import { BannerportadaComponent } from '../bannerportada/bannerportada.component';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router'; // ✅ Para redirigir al inicio

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
    private router: Router // ✅ Servicio para navegar
  ) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      const usuario = {
        ...this.registroForm.value,
        fotoPerfil: 'assets/images/default-avatar.png'
      };

      this.http.post('http://localhost:8080/api/usuarios/registro', usuario, { responseType: 'json' })
        .subscribe({
          next: (response) => {
            console.log('✅ Usuario registrado:', response);
            this.mensajeExito = 'Registro exitoso. Bienvenida a Mamás Perrunas.';
            this.mensajeError = null;
            this.registroForm.reset();

            // ✅ Redirigir al inicio después de 2 segundos (opcional)
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

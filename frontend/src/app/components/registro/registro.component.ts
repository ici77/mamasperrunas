import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { NgIf } from '@angular/common'; 
import { BannerportadaComponent } from '../bannerportada/bannerportada.component';  // Importa el componente correctamente
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-registro',
  templateUrl: './registro.component.html',
  styleUrls: ['./registro.component.css'],
  standalone: true,
  imports: [ReactiveFormsModule, NgIf, CommonModule, BannerportadaComponent]  // Agrega el componente a los imports
})
export class RegistroComponent {
  registroForm: FormGroup;
  mensajeExito: string | null = null;
  mensajeError: string | null = null;

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.registroForm = this.fb.group({
      nombre: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(50)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  onSubmit(): void {
    if (this.registroForm.valid) {
      // Agregar la imagen predeterminada antes de enviar los datos
      const usuario = {
        ...this.registroForm.value,
        fotoPerfil: 'assets/images/avatar.png'  // Imagen predeterminada
      };

      this.http.post('http://localhost:8080/auth/register', usuario).subscribe({
        next: (response) => {
          this.mensajeExito = 'Gracias por registrarte. Inicia sesión.';
          this.mensajeError = null;
          this.registroForm.reset();
        },
        error: (err) => {
          this.mensajeError = 'Ocurrió un error al registrarse. Por favor, inténtalo de nuevo.';
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

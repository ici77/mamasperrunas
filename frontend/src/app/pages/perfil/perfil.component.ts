import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService, PerfilUsuario } from '../../services/usuario.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {

  perfil: PerfilUsuario = {
    nombre: '',
    email: '',
    fotoPerfil: '',
    gustos: '',
    postsCreados: [],
    postsLike: [],
    postsFavoritos: [],
    eventosCreados: [],
    eventosInscrito: [],
    estadisticas: {
      totalPosts: 0,
      totalLikes: 0,
      totalEventos: 0
    }
  };

  gustos: string = '';
  isLoading = true;
  error = '';

  actual = '';
  nueva = '';
  cambiandoPassword = false;

  constructor(private usuarioService: UsuarioService) {}

  ngOnInit(): void {
    this.cargarPerfil();
  }

  cargarPerfil(): void {
    this.usuarioService.getPerfil().subscribe({
      next: (data) => {
        this.perfil = data;
        this.gustos = localStorage.getItem('gustos') || '';
        this.isLoading = false;
      },
      error: () => {
        this.error = 'No se pudo cargar el perfil.';
        this.isLoading = false;
      }
    });
  }

  guardarCambios(): void {
    if (!this.perfil) return;

    localStorage.setItem('gustos', this.gustos);

    this.usuarioService.actualizarNombre(this.perfil.nombre).subscribe({
      next: () => alert('✅ Cambios guardados con éxito'),
      error: () => alert('❌ Error al guardar cambios'),
    });
  }

  getRutaFotoPerfil(): string {
    const ruta = this.perfil?.fotoPerfil;

    if (!ruta) {
      return 'assets/images/default-avatar.png';
    }

    if (ruta.includes('assets')) {
      return ruta;
    }

    return 'http://localhost:8080' + ruta;
  }

  imgErrorHandler(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
  }

  cambiarPassword(): void {
    if (!this.actual || !this.nueva) {
      alert('Por favor completa ambos campos de contraseña');
      return;
    }

    this.usuarioService.cambiarPassword({ actual: this.actual, nueva: this.nueva }).subscribe({
      next: (respuesta) => {
       const mensaje = (respuesta as any).mensaje || 'Contraseña actualizada correctamente';

        alert('✅ ' + mensaje);
        this.actual = '';
        this.nueva = '';
        this.cambiandoPassword = false;
      },
      error: (error) => {
        const mensaje = error?.error?.error || '❌ La contraseña actual no es correcta';
        alert(mensaje);
      }
    });
  }

  seleccionarArchivo(): void {
    const input = document.getElementById('inputFoto') as HTMLInputElement;
    input?.click();
  }

  subirImagen(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const imagen = input.files[0];
    const formData = new FormData();
    formData.append('imagen', imagen);

    this.usuarioService.subirImagen(formData).subscribe({
      next: () => this.cargarPerfil(),
      error: () => alert('❌ Error al subir imagen')
    });
  }
}

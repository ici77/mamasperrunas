import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService, PerfilUsuario } from '../../services/usuario.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';


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

  // 🔁 Índices de paginación
  paginaLikes = 0;
  paginaFavoritos = 0;
  paginaEventosInscrito = 0;
  paginaEventosCreados = 0;
  paginaPostsCreados = 0;
  itemsPorPagina = 5;

  constructor(private usuarioService: UsuarioService,private authService: AuthService) {}

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
      next: (respuesta) => {
        const mensaje = (respuesta as any).mensaje || 'Cambios guardados con éxito';
        alert('✅ ' + mensaje);
      },
      error: (error) => {
        const mensaje = error?.error?.error || '❌ Error al guardar cambios';
        alert(mensaje);
      },
    });
  }

  getRutaFotoPerfil(): string {
  const ruta = this.perfil?.fotoPerfil;

  if (!ruta) return 'assets/images/default-avatar.png';

  // Si ya es una ruta completa (http) o está en assets, se devuelve tal cual
  if (ruta.startsWith('http') || ruta.includes('assets')) return ruta;

  // Si es una ruta del backend tipo "/uploads/..." se concatena
  return environment.imagenUrlBase + ruta.replace(/^\/?uploads\//, '');
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
    next: () => {
      // 🔁 Cargar perfil actualizado
      this.usuarioService.getPerfil().subscribe(perfil => {
        this.perfil = perfil;

        // ✅ Actualizar los datos del usuario en el AuthService para que la navbar también se actualice
        this.authService.refrescarDatosUsuario(perfil.fotoPerfil);
      });
    },
    error: () => alert('❌ Error al subir imagen')
  });
}


  // 🔁 Métodos para obtener elementos paginados
  getPostsCreadosPaginados() {
    const start = this.paginaPostsCreados * this.itemsPorPagina;
    return this.perfil.postsCreados.slice(start, start + this.itemsPorPagina);
  }

  getPostsLikePaginados() {
    const start = this.paginaLikes * this.itemsPorPagina;
    return this.perfil.postsLike.slice(start, start + this.itemsPorPagina);
  }

  getPostsFavoritosPaginados() {
    const start = this.paginaFavoritos * this.itemsPorPagina;
    return this.perfil.postsFavoritos.slice(start, start + this.itemsPorPagina);
  }

  getEventosInscritoPaginados() {
    const start = this.paginaEventosInscrito * this.itemsPorPagina;
    return this.perfil.eventosInscrito.slice(start, start + this.itemsPorPagina);
  }

  getEventosCreadosPaginados() {
    const start = this.paginaEventosCreados * this.itemsPorPagina;
    return this.perfil.eventosCreados.slice(start, start + this.itemsPorPagina);
  }
cancelarInscripcion(eventoId: number): void {
  const confirmar = confirm("¿Estás seguro de que deseas cancelar tu inscripción a este evento?");
  if (!confirmar) return;

  this.usuarioService.cancelarInscripcion(eventoId).subscribe({
    next: () => {
      alert("✅ Inscripción cancelada correctamente");
      this.cargarPerfil(); // Recarga el perfil para actualizar la lista de eventos inscritos
    },
    error: (error) => {
      const mensaje = error?.error?.error || "❌ No se pudo cancelar la inscripción";
      alert(mensaje);
    }
  });
}

  // 🔁 Métodos para avanzar o retroceder en la paginación
  cambiarPagina(tipo: string, direccion: number): void {
    switch (tipo) {
      case 'postsCreados':
        this.paginaPostsCreados += direccion;
        break;
      case 'likes':
        this.paginaLikes += direccion;
        break;
      case 'favoritos':
        this.paginaFavoritos += direccion;
        break;
      case 'inscritos':
        this.paginaEventosInscrito += direccion;
        break;
      case 'creados':
        this.paginaEventosCreados += direccion;
        break;
    }
  }
}

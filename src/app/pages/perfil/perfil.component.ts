import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { UsuarioService, PerfilUsuario } from '../../services/usuario.service';
import { RouterModule } from '@angular/router';
import { environment } from '../../../environments/environment';
import { AuthService } from '../../services/auth.service';

/**
 * Componente para gestionar el perfil de usuario.
 * Permite visualizar y editar información del perfil, como nombre, foto de perfil, gustos,
 * así como gestionar las publicaciones creadas, los posts con likes, los eventos inscritos, entre otros.
 * También permite cambiar la contraseña y manejar la paginación de los posts y eventos.
 * 
 * @component
 * @example
 * <app-perfil></app-perfil>
 */
@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, HttpClientModule, FormsModule, RouterModule],
  templateUrl: './perfil.component.html',
  styleUrls: ['./perfil.component.css']
})
export class PerfilComponent implements OnInit {
  /** Información del perfil de usuario */
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

  /** Gustos del usuario (almacenados en localStorage) */
  gustos: string = '';

  /** Estado de carga de los datos del perfil */
  isLoading = true;

  /** Error en caso de no poder cargar el perfil */
  error = '';

  /** Contraseñas para cambiar */
  actual = '';
  nueva = '';

  /** Estado de si el usuario está cambiando la contraseña */
  cambiandoPassword = false;

  /** Paginación de los elementos del perfil */
  paginaLikes = 0;
  paginaFavoritos = 0;
  paginaEventosInscrito = 0;
  paginaEventosCreados = 0;
  paginaPostsCreados = 0;
  itemsPorPagina = 5;

  /**
   * Constructor para inicializar los servicios de usuario y autenticación.
   * 
   * @param usuarioService - Servicio para manejar las operaciones relacionadas con el usuario
   * @param authService - Servicio para manejar la autenticación del usuario
   */
  constructor(private usuarioService: UsuarioService, private authService: AuthService) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga el perfil del usuario.
   */
  ngOnInit(): void {
    this.cargarPerfil();
  }

  /**
   * Método que carga los datos del perfil desde el servicio.
   * 
   * Si ocurre un error al cargar el perfil, muestra un mensaje de error.
   */
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

  /**
   * Guarda los cambios realizados en el perfil (nombre y gustos).
   * 
   * Actualiza los gustos en el `localStorage` y el nombre en el backend.
   */
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

  /**
   * Obtiene la URL de la foto de perfil.
   * Si no existe, retorna una imagen por defecto.
   * 
   * @returns URL de la foto de perfil
   */
  getRutaFotoPerfil(): string {
    const ruta = this.perfil?.fotoPerfil;

    if (!ruta) return 'assets/images/default-avatar.png';

    // Si ya es una URL completa (http) o está en assets, se devuelve tal cual
    if (ruta.startsWith('http') || ruta.includes('assets')) return ruta;

    // Si es una ruta del backend tipo "/uploads/..." se concatena
    return environment.imagenUrlBase + ruta.replace(/^\/?uploads\//, '');
  }

  /**
   * Maneja el error de carga de la imagen de perfil.
   * Si la imagen no se carga correctamente, se asigna una imagen por defecto.
   * 
   * @param event - Evento de error al cargar la imagen
   */
  imgErrorHandler(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
  }

  /**
   * Cambia la contraseña del usuario.
   * 
   * Valida que ambos campos (contraseña actual y nueva) estén llenos antes de enviarlos al backend.
   */
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

  /**
   * Abre el selector de archivo para cambiar la foto de perfil.
   */
  seleccionarArchivo(): void {
    const input = document.getElementById('inputFoto') as HTMLInputElement;
    input?.click();
  }

  /**
   * Subir una nueva imagen de perfil.
   * 
   * El archivo seleccionado se envía al backend para ser almacenado.
   * Al completarse, se recarga el perfil con la nueva foto.
   * 
   * @param event - Evento de cambio al seleccionar un archivo
   */
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

  /**
   * Cancela la inscripción de un usuario a un evento.
   * 
   * @param eventoId - ID del evento del que el usuario se desea desinscribir
   */
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

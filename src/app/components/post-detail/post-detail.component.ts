import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';

/**
 * Componente para mostrar los detalles de un post, incluidos los likes, dislikes, respuestas y recomendaciones.
 * 
 * @component
 * @example
 * <app-post-detail></app-post-detail>
 */
@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  /** Detalles del post */
  post: any = null;

  /** ID del post actual */
  postId: number = 0;

  /** Estado de carga de los datos */
  isLoading: boolean = true;

  /** Mensaje de error en caso de fallo */
  errorMessage: string = '';

  /** ID del usuario autenticado */
  usuarioId: number = 0;

  /** Total de likes del post */
  totalLikes: number = 0;

  /** Estado si el usuario ha dado like al post */
  yaDioLike: boolean = false;

  /** Total de dislikes del post */
  totalDislikes: number = 0;

  /** Estado si el usuario ha dado dislike al post */
  yaDioDislike: boolean = false;

  /** Estado si el post es favorito del usuario */
  yaEsFavorito: boolean = false;

  /** Estado si el post ha sido reportado por el usuario */
  yaReportado: boolean = false;

  /** Lista de posts recomendados por categoría */
  recentPosts: any[] = [];

  /** Texto de la respuesta del usuario */
  respuestaTexto: string = '';

  /** Respuestas al post */
  respuestas: any[] = [];

  /**
   * Constructor para inicializar el servicio de rutas y el servicio de posts.
   * 
   * @param route - Activador de rutas para obtener parámetros
   * @param postService - Servicio para manejar la lógica de posts
   */
  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  /**
   * Método llamado al inicializar el componente. Recupera el ID del post desde los parámetros de la URL
   * y carga el post si el ID es válido.
   */
  ngOnInit() {
    const storedUser = localStorage.getItem('usuario');
    if (storedUser) {
      const usuario = JSON.parse(storedUser);
      this.usuarioId = usuario.id;
    }

    this.route.paramMap.subscribe(params => {
      this.postId = Number(params.get('id'));
      if (this.postId) {
        this.loadPost();
      }
    });
  }

  /**
   * Carga el post completo desde el servicio.
   */
  loadPost() {
    this.postService.getPostById(this.postId).subscribe({
      next: (response) => {
        this.post = response.post;
        this.totalLikes = response.totalLikes ?? 0;
        this.totalDislikes = response.totalDislikes ?? 0;
        this.isLoading = false;

        this.yaDioLike = response.liked ?? false;
        this.yaDioDislike = response.disliked ?? false;

        this.cargarRespuestas();

        if (this.post?.category?.name) {
          this.cargarRecomendados(this.post.category.name);
        }

        this.verificarFavorito();
        this.verificarReporte();
      },
      error: (error) => {
        console.error('❌ Error al cargar el post:', error);
        this.errorMessage = 'No se pudo cargar el post. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }

  /**
   * Carga posts recomendados según la categoría del post actual.
   * 
   * @param categoria - Nombre de la categoría para filtrar los posts recomendados
   */
  cargarRecomendados(categoria: string): void {
    this.postService.getRandomPostsByCategory(categoria, 6).subscribe((data) => {
      this.recentPosts = data.filter(p => p.id !== this.post.id);
    });
  }

  /**
   * Alterna el estado de "Me gusta" para el post actual.
   * Si el usuario no está autenticado, muestra un mensaje de alerta.
   */
  toggleLike() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert("⚠️ Debes iniciar sesión para dar 'Me gusta'");
      return;
    }

    this.postService.toggleLike(this.postId).subscribe({
      next: (respuesta: any) => {
        this.totalLikes = respuesta.totalLikes ?? this.totalLikes;
        this.yaDioLike = respuesta.liked ?? !this.yaDioLike;
      },
      error: (error) => {
        console.error("❌ Error al enviar el like:", error);
        alert("No se pudo procesar el 'Me gusta'.");
      }
    });
  }

  /**
   * Alterna el estado de "No me gusta" para el post actual.
   * Si el usuario no está autenticado, muestra un mensaje de alerta.
   */
  toggleDislike() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert("⚠️ Debes iniciar sesión para dar 'No me gusta'");
      return;
    }

    this.postService.toggleDislike(this.postId).subscribe({
      next: (respuesta: any) => {
        this.totalDislikes = respuesta.totalDislikes ?? this.totalDislikes;
        this.yaDioDislike = respuesta.disliked ?? !this.yaDioDislike;
      },
      error: (error) => {
        console.error("❌ Error al enviar el dislike:", error);
        alert("No se pudo procesar el 'No me gusta'.");
      }
    });
  }

  /**
   * Envía una respuesta al post actual.
   * La respuesta debe tener entre 50 y 300 caracteres.
   * 
   * @param texto - Contenido de la respuesta
   */
  responder() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert("⚠️ Debes iniciar sesión para responder.");
      return;
    }

    const texto = this.respuestaTexto.trim();

    if (texto.length < 50) {
      alert("⚠️ La respuesta debe tener al menos 50 caracteres.");
      return;
    }

    if (texto.length > 300) {
      alert("⚠️ La respuesta no puede superar los 300 caracteres.");
      return;
    }

    const nuevaRespuesta = {
      content: texto,
      postId: this.postId
    };

    this.postService.createReply(nuevaRespuesta).subscribe({
      next: () => {
        this.respuestaTexto = '';
        this.cargarRespuestas();
      },
      error: (err) => {
        console.error("❌ Error al responder:", err);
        alert("No se pudo publicar la respuesta.");
      }
    });
  }

  /**
   * Carga las respuestas asociadas al post.
   */
  cargarRespuestas() {
    this.postService.getRepliesByPost(this.postId).subscribe({
      next: (respuestas) => {
        this.respuestas = respuestas.content || respuestas;
      },
      error: (err) => {
        console.error("❌ Error al cargar respuestas:", err);
      }
    });
  }

  /**
   * Alterna el estado de "Favorito" para el post actual.
   * Si el usuario no está autenticado, muestra un mensaje de alerta.
   */
  marcarFavorito() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert("⚠️ Debes iniciar sesión para usar favoritos.");
      return;
    }

    this.postService.toggleFavorito(this.postId).subscribe({
      next: (res) => {
        this.yaEsFavorito = res.favorito ?? !this.yaEsFavorito;
      },
      error: (err) => {
        console.error("❌ Error al alternar favorito:", err);
        alert("Hubo un error al guardar/actualizar el favorito.");
      }
    });
  }

  /**
   * Verifica si el post actual ya es favorito del usuario.
   */
  verificarFavorito() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.postService.hasUserFavorited(this.postId).subscribe({
      next: (res) => this.yaEsFavorito = res,
      error: (err) => console.warn("ℹ️ No se pudo verificar favoritos:", err)
    });
  }

  /**
   * Alterna el estado de "Reportado" para el post actual.
   * Si el usuario no está autenticado, muestra un mensaje de alerta.
   */
  reportarPost() {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      alert("⚠️ Debes iniciar sesión para reportar.");
      return;
    }

    this.postService.toggleReport(this.postId).subscribe({
      next: (res) => {
        this.yaReportado = res.reportado ?? !this.yaReportado;
      },
      error: (err) => {
        console.error("❌ Error al alternar reporte:", err);
        alert("Hubo un error al reportar/quitar reporte.");
      }
    });
  }

  /**
   * Verifica si el post actual ha sido reportado por el usuario.
   */
  verificarReporte() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.postService.hasUserReported(this.postId).subscribe({
      next: (res) => this.yaReportado = res,
      error: (err) => console.warn("ℹ️ No se pudo verificar reporte:", err)
    });
  }

  /**
   * Devuelve la URL de la imagen, manejando rutas relativas y absolutas.
   * 
   * @param ruta - Ruta de la imagen
   * @returns URL de la imagen procesada
   */
  getImagenUrl(ruta: string): string {
    if (!ruta) return 'assets/images/default-avatar.png';
    if (ruta.startsWith('http')) return ruta;

    const cleanPath = ruta.replace(/^\/?uploads\//, '');
    return `${environment.imagenUrlBase}${cleanPath}`;
  }

  /**
   * Manejador de error para imágenes que no se cargan correctamente.
   * 
   * @param event - Evento de error al cargar imagen
   */
  imgErrorHandler(event: Event): void {
    (event.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
  }
}

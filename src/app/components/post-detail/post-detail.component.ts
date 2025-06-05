import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule, FormsModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: any = null;
  postId: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';

  usuarioId: number = 0;
  totalLikes: number = 0;
  yaDioLike: boolean = false;
  totalDislikes: number = 0;
  yaDioDislike: boolean = false;
  yaEsFavorito: boolean = false;
  yaReportado: boolean = false;

  recentPosts: any[] = [];
  respuestaTexto: string = '';
  respuestas: any[] = [];

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

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

  cargarRecomendados(categoria: string): void {
    this.postService.getRandomPostsByCategory(categoria, 6).subscribe((data) => {
      this.recentPosts = data.filter(p => p.id !== this.post.id);
    });
  }

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
 // ✅ USAR SOLO TOGGLE PARA FAVORITOS
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

  verificarFavorito() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.postService.hasUserFavorited(this.postId).subscribe({
      next: (res) => this.yaEsFavorito = res,
      error: (err) => console.warn("ℹ️ No se pudo verificar favoritos:", err)
    });
  }

  // ✅ USAR SOLO TOGGLE PARA REPORTES
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

  verificarReporte() {
    const token = localStorage.getItem('auth_token');
    if (!token) return;

    this.postService.hasUserReported(this.postId).subscribe({
      next: (res) => this.yaReportado = res,
      error: (err) => console.warn("ℹ️ No se pudo verificar reporte:", err)
    });
  }

  getImagenUrl(ruta: string): string {
  if (!ruta) return 'assets/images/default-avatar.png';
  if (ruta.startsWith('http')) return ruta;

  // Elimina cualquier "/uploads/" duplicado
  const cleanPath = ruta.replace(/^\/?uploads\//, '');
  return `${environment.imagenUrlBase}${cleanPath}`;
}
imgErrorHandler(event: Event): void {
  (event.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
}


}
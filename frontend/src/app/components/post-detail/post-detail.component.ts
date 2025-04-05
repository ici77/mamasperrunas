import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

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

        this.cargarRespuestas();

        if (this.post?.category?.name) {
          this.cargarRecomendados(this.post.category.name);
        }
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
        alert(respuesta.mensaje || '👍 Acción realizada');
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
        alert(respuesta.mensaje || '👎 Acción realizada');
        if (respuesta.totalDislikes !== undefined) {
          this.totalDislikes = respuesta.totalDislikes;
        }
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

    if (!this.respuestaTexto.trim()) {
      alert("⚠️ La respuesta no puede estar vacía.");
      return;
    }

    const nuevaRespuesta = {
      content: this.respuestaTexto,
      postId: this.postId
    };

    this.postService.createReply(nuevaRespuesta).subscribe({
      next: () => {
        alert("✅ Respuesta publicada.");
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
}

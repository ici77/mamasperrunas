import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: any = null;
  postId: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';

  // 🔸 Propiedades para "me gusta"
  usuarioId: number = 0;
  totalLikes: number = 0;
  yaDioLike: boolean = false; // Por ahora siempre inicia en falso

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit() {
    // 🔐 Recuperar usuario logueado
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
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar el post:', error);
        this.errorMessage = 'No se pudo cargar el post. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }
  /** 🔁 Alternar "Me gusta" */
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

  

 
    }
    
  

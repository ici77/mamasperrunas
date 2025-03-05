import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service'; // ✅ Importado correctamente
import { HttpErrorResponse } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-foro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-foro.component.html',
  styleUrls: ['./category-foro.component.css']
})
export class CategoryForoComponent implements OnInit {
  categoryName: string = '';
  topPosts: any[] = [];
  allPosts: any[] = [];
  currentPage: number = 0;
  totalPages: number = 1;
  pageSize: number = 10;
  isLoggedIn: boolean = false;
  nombreUsuario?: string;
  fotoPerfil?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private postService: PostService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('category') || '';

      if (this.categoryName) {
        this.loadTopPosts();
        this.loadAllPosts();
      }
    });

    // ✅ Suscribirse a cambios en la autenticación y obtener datos del usuario
    this.authService.getUserDataObservable().subscribe(userData => {
      this.isLoggedIn = !!userData; // Si hay datos de usuario, está autenticado
      this.nombreUsuario = userData?.nombre;
      this.fotoPerfil = userData?.foto_perfil;
    });
  }

  /**
   * 📌 Carga los 4 posts más votados en la categoría actual con manejo de errores.
   */
  loadTopPosts() {
    this.postService.getTopPostsByCategory(this.categoryName).subscribe({
      next: data => {
        this.topPosts = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar los posts destacados:', error);
        if (error.status === 403) {
          console.error('⛔ No tienes permisos para ver estos posts.');
        } else if (error.status === 401) {
          console.error('⚠️ Debes iniciar sesión para acceder.');
        }
      }
    });
  }

  /**
   * 📌 Carga los posts de la categoría con paginación y manejo de errores.
   */
  loadAllPosts() {
    this.postService.getPaginatedPosts(this.categoryName, this.currentPage, this.pageSize).subscribe({
      next: response => {
        this.allPosts = response.content;
        this.totalPages = response.totalPages;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar los posts:', error);
        if (error.status === 403) {
          console.error('⛔ Acceso prohibido a los posts.');
        } else if (error.status === 401) {
          console.error('⚠️ Debes iniciar sesión para ver los posts.');
        }
      }
    });
  }

  openPost(postId: number) {
    this.router.navigateByUrl(`/post/${postId}`);
  }

  /**
   * 📌 Avanza a la siguiente página de posts en la paginación.
   */
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAllPosts();
    }
  }

  /**
   * 📌 Retrocede a la página anterior en la paginación de posts.
   */
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAllPosts();
    }
  }

  /**
   * 📌 Redirige al usuario autenticado a la página de creación de un nuevo post.
   */
  goToCreatePost() {
    if (this.isLoggedIn) {
      this.router.navigateByUrl('/crear-post');
    } else {
      this.router.navigateByUrl('/login');
    }
  }

  /**
   * 📌 Redirige al usuario autenticado a la página de respuesta de un post.
   *
   * @param postId ID del post al que se responderá.
   */
 
}

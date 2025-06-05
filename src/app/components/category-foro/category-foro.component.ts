import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { PostService } from '../../services/post.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-category-foro',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './category-foro.component.html',
  styleUrls: ['./category-foro.component.css']
})
export class CategoryForoComponent implements OnInit {

  // 📌 Nombre de la categoría obtenida desde la URL
  categoryName: string = '';

  // 📌 Listas de posts destacados y todos los posts de la categoría
  topPosts: any[] = [];
  allPosts: any[] = [];

  // 📌 Paginación
  currentPage: number = 0;
  totalPages: number = 1;
  pageSize: number = 10;

  // 📌 Datos del usuario autenticado
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
    // 🔄 Cuando cambia la categoría en la URL, cargamos los datos
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('category') || '';
      if (this.categoryName) {
        this.loadTopPosts();
        this.loadAllPosts();
      }
    });

    // 👤 Comprobamos si el usuario está autenticado y extraemos su info
    this.authService.getUserDataObservable().subscribe(userData => {
      this.isLoggedIn = !!userData;
      this.nombreUsuario = userData?.nombre;
      this.fotoPerfil = userData?.foto_perfil;
    });
  }

  /**
   * 🔝 Carga los posts destacados de la categoría actual
   */
  loadTopPosts() {
    this.postService.getTopPostsByCategory(this.categoryName).subscribe({
      next: data => {
        this.topPosts = data;
      },
      error: (error: HttpErrorResponse) => {
        console.error('❌ Error al cargar los posts destacados:', error);
      }
    });
  }

  /**
   * 📄 Carga los posts paginados de la categoría
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
          console.error('⛔ Acceso prohibido.');
        } else if (error.status === 401) {
          console.error('⚠️ Debes iniciar sesión.');
        }
      }
    });
  }

  /**
   * ➡️ Avanza una página
   */
  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAllPosts();
    }
  }

  /**
   * ⬅️ Retrocede una página
   */
  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAllPosts();
    }
  }

  /**
   * 📝 Redirige a crear post si está logueado, si no a login
   */
  goToCreatePost() {
    this.router.navigateByUrl(this.isLoggedIn ? '/crear-post' : '/login');
  }

  /**
   * 🔍 Redirige al detalle del post
   */
  openPost(postId: number) {
    this.router.navigateByUrl(`/post/${postId}`);
  }

  /**
   * 🖼️ Devuelve la URL completa y válida de la imagen de perfil del autor del post.
   * Soporta:
   * - Imágenes externas (http)
   * - Imágenes del frontend (assets/)
   * - Imágenes servidas por el backend (uploads/)
   */
  getFotoPerfilUrl(post: any): string {
  const foto = post?.user?.fotoPerfil;

  if (!foto) {
    return 'assets/images/default-avatar.png';
  }

  if (foto.startsWith('http') || foto.startsWith('https')) {
    return foto;
  }

  if (foto.startsWith('assets/')) {
    return foto;
  }

  // Elimina el prefijo '/uploads/' si lo trae y construye la URL con base de entorno
  return `${environment.imagenUrlBase}${foto.replace(/^\/?uploads\//, '')}`;
}
getImagenUrl(imagenUrl: string): string {
  if (!imagenUrl) {
    return 'assets/images/default-thumbnail.png'; // miniatura por defecto
  }

  if (imagenUrl.startsWith('http') || imagenUrl.startsWith('https')) {
    return imagenUrl;
  }

  if (imagenUrl.startsWith('assets/')) {
    return imagenUrl;
  }

  // Ruta de imagen servida desde backend (quita el prefijo /uploads/ si lo tiene)
  return `${environment.imagenUrlBase}${imagenUrl.replace(/^\/?uploads\//, '')}`;
}

}

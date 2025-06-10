import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';

/**
 * Componente para crear un nuevo post en la aplicación.
 * El usuario puede escribir un título, contenido, seleccionar una categoría, y agregar una imagen.
 * 
 * @component
 * @example
 * <app-crear-post></app-crear-post>
 */
@Component({
  selector: 'app-crear-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-post.component.html',
  styleUrls: ['./crear-post.component.css']
})
export class CrearPostComponent implements OnInit {
  /** Datos del nuevo post a enviar al backend */
  post = {
    title: '',
    content: '',
    category: { id: null },
    tags: []
  };

  /** Imagen seleccionada por el usuario */
  imagenSeleccionada: File | null = null;

  /** Lista de categorías para elegir al crear un post */
  categories: any[] = [];

  /** Límite máximo de caracteres para el contenido del post */
  maxContentLength = 500;

  /** Contador de caracteres restantes para el contenido */
  remainingCharacters = this.maxContentLength;

  /**
   * Constructor para inicializar el servicio HTTP y el servicio de autenticación.
   * 
   * @param http - Servicio HTTP para realizar solicitudes al backend
   * @param authService - Servicio para manejar la autenticación del usuario
   */
  constructor(private http: HttpClient, private authService: AuthService) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga las categorías disponibles desde el backend.
   */
  ngOnInit() {
    this.loadCategories();
  }

  /**
   * Carga las categorías desde el backend para que el usuario pueda seleccionarlas al crear un post.
   * Si no hay un token de autenticación, muestra un error en consola.
   */
  loadCategories() {
    const token = this.authService.getToken();
    if (!token) {
      console.error('⚠️ No hay token de autenticación.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>(`${environment.apiUrl}/categories`, { headers })
      .subscribe({
        next: (data) => this.categories = data,
        error: (err) => console.error('❌ Error al cargar categorías:', err)
      });
  }

  /**
   * Método que maneja la selección de una imagen para el post.
   * 
   * @param event - Evento de cambio al seleccionar un archivo
   */
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      console.log('📸 Imagen seleccionada:', file);
    }
  }

  /**
   * Método que controla la longitud del contenido del post.
   * Si el contenido excede el límite de caracteres, se recorta automáticamente.
   * Actualiza el contador de caracteres restantes.
   */
  onContentChange() {
    const content = this.post.content || '';
    if (content.length > this.maxContentLength) {
      this.post.content = content.slice(0, this.maxContentLength); // Recorta el exceso
    }
    this.remainingCharacters = this.maxContentLength - this.post.content.length;
  }

  /**
   * Método que envía el nuevo post al backend.
   * Realiza validaciones antes de enviar el post y muestra mensajes de error o éxito.
   */
  submitPost() {
    const token = this.authService.getToken();
    if (!token) {
      alert('⚠️ Inicia sesión para crear un post.');
      return;
    }

    // ✅ Validar título
    if (!this.post.title.trim()) {
      alert('⚠️ Debes escribir un título para tu post.');
      return;
    }

    // ✅ Validar categoría seleccionada
    if (!this.post.category.id) {
      alert('⚠️ Debes seleccionar una categoría.');
      return;
    }

    // ✅ Validar longitud mínima del contenido
    if (this.post.content.length < 100) {
      alert('⚠️ El contenido debe tener al menos 100 caracteres.');
      return;
    }

    const formData = new FormData();
    formData.append('title', this.post.title);
    formData.append('content', this.post.content);
    formData.append('categoryId', String(this.post.category.id));

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.post(`${environment.apiUrl}/posts/crear-con-imagen`, formData, { headers })
      .subscribe({
        next: () => alert('✅ Post creado correctamente'),
        error: (err) => {
          console.error('❌ Error al crear post:', err);
          alert('❌ Hubo un error al crear el post.');
        }
      });
  }

  /**
   * Método para aplicar formato de texto al contenido del post. 
   * Este método es opcional y usa `execCommand` para aplicar cambios en el formato.
   * 
   * @param command - El comando de formato a aplicar
   */
  applyFormat(command: string) {
    document.execCommand(command, false);
  }
}

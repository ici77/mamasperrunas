import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-crear-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-post.component.html',
  styleUrls: ['./crear-post.component.css']
})
export class CrearPostComponent implements OnInit {
  // 📝 Datos del post a enviar
  post = {
    title: '',
    content: '',
    category: { id: null },
    tags: []
  };

  imagenSeleccionada: File | null = null;
  categories: any[] = [];

  // 🔢 Límite de caracteres y contador
  maxContentLength = 500;
  remainingCharacters = this.maxContentLength;

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadCategories();
  }

  // 📥 Cargar categorías desde el backend
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

  // 🖼️ Manejar selección de imagen
  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      console.log('📸 Imagen seleccionada:', file);
    }
  }

  // 📝 Control de longitud del contenido
  onContentChange() {
    const content = this.post.content || '';
    if (content.length > this.maxContentLength) {
      this.post.content = content.slice(0, this.maxContentLength); // Recorta el exceso
    }
    this.remainingCharacters = this.maxContentLength - this.post.content.length;
  }

  // 🚀 Enviar el post al backend
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

  // ✏️ Aplicar formato (opcional si usas execCommand)
  applyFormat(command: string) {
    document.execCommand(command, false);
  }
}

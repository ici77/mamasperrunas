import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { AuthService } from '../../services/auth.service'; // ✅ Servicio de autenticación

@Component({
  selector: 'app-crear-post',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-post.component.html',
  styleUrls: ['./crear-post.component.css']
})
export class CrearPostComponent implements OnInit {
  post = {
    title: '',
    content: '',
    category: { id: null },
    tags: []
  };

  imagenSeleccionada: File | null = null;
  categories: any[] = [];

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadCategories();
  }

  loadCategories() {
    const token = this.authService.getToken();
    if (!token) {
      console.error('⚠️ No hay token de autenticación.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    this.http.get<any[]>('http://localhost:8080/api/categories', { headers })
      .subscribe({
        next: (data) => this.categories = data,
        error: (err) => console.error('❌ Error al cargar categorías:', err)
      });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.imagenSeleccionada = file;
      console.log('📸 Imagen seleccionada:', file);
    }
  }

  submitPost() {
  const token = this.authService.getToken();
  if (!token) {
    alert('⚠️ Inicia sesión para crear un post.');
    return;
  }

  const formData = new FormData();
  formData.append('title', this.post.title);
  formData.append('content', this.post.content);

  // ✅ Validar categoría seleccionada
  if (this.post.category.id !== null) {
    formData.append('categoryId', String(this.post.category.id));

  } else {
    alert('⚠️ Debes seleccionar una categoría.');
    return;
  }

  // ✅ Adjuntar imagen si fue seleccionada
  if (this.imagenSeleccionada) {
    formData.append('imagen', this.imagenSeleccionada);
  }

  const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

  this.http.post('http://localhost:8080/api/posts/crear-con-imagen', formData, { headers })
    .subscribe({
      next: () => alert('✅ Post creado correctamente'),
      error: (err) => {
        console.error('❌ Error al crear post:', err);
        alert('❌ Hubo un error al crear el post.');
      }
    });
}

  applyFormat(command: string) {
    document.execCommand(command, false);
  }
}

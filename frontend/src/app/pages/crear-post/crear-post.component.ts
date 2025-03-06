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
    category: { id: null },  // ✅ Debe ser un objeto con "id"
    user: { id: null },  // ✅ Debe ser un objeto con "id"
    tags: [],
    imageUrls: []
  };
  

  categories: any[] = []; // ✅ Lista de categorías disponibles

  constructor(private http: HttpClient, private authService: AuthService) {}

  ngOnInit() {
    this.loadCategories();
    this.loadUserData(); // ✅ Obtener usuario autenticado
  }

  loadCategories() {
    const token = this.authService.getToken(); // ✅ Obtener el token del AuthService
  
    if (!token) {
      console.error('⚠️ No hay token de autenticación. No se pueden cargar las categorías.');
      return;
    }
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`); // ✅ Agregar token en la cabecera
  
    this.http.get<any[]>('http://localhost:8080/api/categories', { headers }).subscribe({
      next: (data) => {
        console.log('✅ Categorías cargadas:', data); // 🛠️ Depuración en consola
        this.categories = data;
      },
      error: (err) => {
        console.error('❌ Error al cargar las categorías:', err);
        if (err.status === 403) {
          console.error('⛔ Acceso denegado: Verifica que el usuario esté autenticado y tenga permisos.');
        }
      }
    });
  }
  
  /**
   * 📌 Obtener los datos del usuario autenticado y asociarlo al post
   */
  loadUserData() {
    const user = this.authService.getUserData();
    if (user) {
      this.post.user = { id: user.id }; // ✅ Asegurar que el usuario tenga el formato correcto
      console.log('✅ Usuario autenticado:', this.post.user);
    } else {
      console.error("❌ No se pudo obtener el usuario autenticado.");
    }
  }
  
  submitPost() {
    const token = this.authService.getToken(); // ✅ Obtener el token de autenticación
  
    if (!token) {
      console.error('⚠️ No hay token de autenticación. No se puede crear el post.');
      alert('Por favor, inicia sesión para crear un post.');
      return;
    }
  
    // ✅ Convertir `categoryId` en objeto `{ id: categoryId }`
    const formattedPost = {
      title: this.post.title,
      content: this.post.content,
      category: { id: this.post.category.id}, // ✅ Se ajusta al formato esperado
      user: { id: this.post.user.id }, // ✅ Se ajusta al formato esperado
      tags: this.post.tags || [], // Si no hay tags, enviar un array vacío
      imageUrls: this.post.imageUrls || [] // Si no hay imágenes, enviar un array vacío
    };
  
    console.log('📢 Datos del Post a Enviar:', formattedPost); // ✅ Verificación en consola
  
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
  
    this.http.post('http://localhost:8080/api/posts', formattedPost, { headers }).subscribe({
      next: () => alert('✅ Post creado correctamente'),
      error: (err) => {
        console.error('❌ Error al crear el post:', err);
        if (err.status === 403) {
          alert('⛔ Acceso denegado: Verifica que estés autenticado y tengas permisos.');
        } else {
          alert('❌ Hubo un error al crear el post. Por favor, inténtalo de nuevo.');
        }
      }
    });
  }
  

  /**
   * 📌 Manejo de imágenes
   */
  onFileSelected(event: any) {
    const files = event.target.files;
    console.log('📸 Imágenes seleccionadas:', files);
  }

  applyFormat(command: string) {
    document.execCommand(command, false);
  }
}
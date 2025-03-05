import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { PostService } from '../../services/post.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-create-post',
  standalone: true, // ✅ Componente standalone
  templateUrl: './create-post.component.html',
  styleUrls: ['./create-post.component.css'],
  imports: [CommonModule, ReactiveFormsModule, HttpClientModule] // ✅ Agregar ReactiveFormsModule
})
export class CreatePostComponent {
  postForm: FormGroup;
  selectedFiles: File[] = [];
  previewImages: string[] = [];

  constructor(private fb: FormBuilder, private postService: PostService) {
    this.postForm = this.fb.group({
      title: ['', Validators.required],
      content: ['', Validators.required]
    });
  }

  /** 📌 Manejo de imágenes */
  onFileSelected(event: any) {
    if (event.target.files.length + this.selectedFiles.length > 3) {
      alert("Solo puedes subir hasta 3 imágenes.");
      return;
    }

    Array.from(event.target.files).forEach((file: any) => {
      if (this.selectedFiles.length < 3) {
        this.selectedFiles.push(file);

        // Previsualizar imágenes
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.previewImages.push(e.target.result);
        };
        reader.readAsDataURL(file);
      }
    });
  }

  /** 📌 Enviar el post al backend */
  submitPost() {
    const formData = new FormData();
    formData.append("title", this.postForm.value.title);
    formData.append("content", this.postForm.value.content);
    
    this.selectedFiles.forEach(file => {
      formData.append("images", file);
    });

    this.postService.createPost(formData).subscribe(response => {
      console.log("Post creado con éxito", response);
      this.postForm.reset();
      this.selectedFiles = [];
      this.previewImages = [];
    });
  }
}

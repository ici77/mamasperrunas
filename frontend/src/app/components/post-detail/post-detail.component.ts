import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';
import { RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-post-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule], // ✅ Agregado RouterModule y HttpClientModule
  templateUrl: './post-detail.component.html',
  styleUrls: ['./post-detail.component.css']
})
export class PostDetailComponent implements OnInit {
  post: any = null;
  postId: number = 0;
  isLoading: boolean = true;
  errorMessage: string = '';

  constructor(
    private route: ActivatedRoute,
    private postService: PostService
  ) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.postId = Number(params.get('id'));
      if (this.postId) {
        this.loadPost();
      }
    });
  }

  /** 📌 Cargar el post desde el backend con manejo de errores */
  loadPost() {
    this.postService.getPostById(this.postId).subscribe({
      next: (response) => {
        this.post = response;
        this.isLoading = false;
      },
      error: (error) => {
        console.error('❌ Error al cargar el post:', error);
        this.errorMessage = 'No se pudo cargar el post. Intenta nuevamente.';
        this.isLoading = false;
      }
    });
  }
}

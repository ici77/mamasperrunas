import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { PostService } from '../../services/post.service';

@Component({
  selector: 'app-category-foro',
  standalone: true,
  imports: [CommonModule],
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

  constructor(private route: ActivatedRoute, private postService: PostService) {}

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      this.categoryName = params.get('category') || '';
      this.loadTopPosts();
      this.loadAllPosts();
    });
  }

  loadTopPosts() {
    this.postService.getTopPostsByCategory(this.categoryName).subscribe(data => {
      this.topPosts = data;
    });
  }

  loadAllPosts() {
    this.postService.getPaginatedPosts(this.categoryName, this.currentPage, this.pageSize).subscribe(response => {
      this.allPosts = response.content;
      this.totalPages = response.totalPages;
    });
  }

  nextPage() {
    if (this.currentPage < this.totalPages - 1) {
      this.currentPage++;
      this.loadAllPosts();
    }
  }

  previousPage() {
    if (this.currentPage > 0) {
      this.currentPage--;
      this.loadAllPosts();
    }
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumbs">
      <a routerLink="/products">Tienda</a> &gt;
      <span>{{ category }}</span>
    </nav>
    <h1>{{ category }}</h1>
    <div class="product-grid">
      <div *ngFor="let product of products" class="product-card">
        <img [src]="product.image" [alt]="product.name" />
        <h3>{{ product.name }}</h3>
        <p>{{ product.description }}</p>
        <a [href]="product.affiliateLink" target="_blank" class="btn btn-primary">Comprar</a>
      </div>
    </div>
  `,
  styleUrls: ['./category-page.component.css'],
})
export class CategoryPageComponent implements OnInit {
  category: string = '';
  products: any[] = [];

  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  ngOnInit(): void {
    this.category = this.route.snapshot.paramMap.get('category') || '';
    this.http.get<any[]>('assets/products.json').subscribe({
      next: (data) => {
        const categoryData = data.find((c) => c.category === this.category);
        this.products = categoryData ? categoryData.products : [];
      },
      error: (err) => console.error('Error al cargar los productos:', err),
    });
  }
}

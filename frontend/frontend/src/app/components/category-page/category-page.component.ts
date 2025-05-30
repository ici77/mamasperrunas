import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';

/**
 * 📌 Componente `CategoryPageComponent`
 *
 * Este componente muestra una página de categoría de productos en la tienda online.
 * Se encarga de obtener la categoría de la URL y mostrar los productos correspondientes.
 *
 * ℹ️ **Uso:** Se utiliza en la tienda para listar productos de una categoría específica.
 *
 * 🏷️ **Ejemplo de URL:** `/products/alimentacion` mostrará todos los productos de la categoría "alimentación".
 */
@Component({
  selector: 'app-category-page',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <nav class="breadcrumbs">
      <a routerLink="/products">Tienda</a> &gt;
      <span>{{ category }}</span>
    </nav>
    <h1>{{ category | titlecase }}</h1>
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
  /**
   * 📌 Categoría actual obtenida de la URL.
   */
  category: string = '';

  /**
   * 📌 Lista de productos pertenecientes a la categoría seleccionada.
   */
  products: any[] = [];

  /**
   * Constructor del componente.
   * @param route - Servicio para obtener parámetros de la URL.
   * @param http - Servicio para hacer peticiones HTTP.
   */
  constructor(private route: ActivatedRoute, private http: HttpClient) {}

  /**
   * 🔹 Método `ngOnInit()`
   *
   * - Se suscribe a los cambios en la URL para detectar cambios de categoría.
   * - Carga los productos desde `assets/products.json` según la categoría seleccionada.
   */
  ngOnInit(): void {
    this.route.paramMap.subscribe((params) => {
      this.category = params.get('category') || '';
      this.loadProducts(); // Recargar productos cada vez que cambia la URL
    });
  }

  /**
   * 📌 Método `loadProducts()`
   *
   * - Carga productos desde el archivo `products.json` basado en la categoría actual.
   * - Maneja errores en la carga de productos.
   */
  loadProducts() {
    this.http.get<any[]>('assets/products.json').subscribe({
      next: (data) => {
        const categoryData = data.find((c) => c.category === this.category);
        this.products = categoryData ? categoryData.products : [];
      },
      error: (err) => console.error('Error al cargar los productos:', err),
    });
  }
}

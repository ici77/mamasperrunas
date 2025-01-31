import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../shared/banner/banner.component'; // Importar el componente banner

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BannerComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
 
})

export class ProductListComponent implements OnInit {
  recommendations: any[] = []; // Productos recomendados
  categories: any[] = []; // Lista de categorías

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.http.get<any[]>('assets/products.json').subscribe({
      next: (data) => {
        this.categories = data.map((category) => ({
          name: category.category, // Nombre de la categoría
          image: category.image, // Imagen de la categoría
          products: this.generateProducts(category.products, 6), // Generar productos dinámicos
        }));
        this.recommendations = this.generateProducts(
          this.categories.flatMap((c) => c.products), // Combinar productos de todas las categorías
          3 // Seleccionar 3 productos como recomendados
        );
      },
      error: (err) => console.error('Error al cargar los productos:', err),
    });
  }

  generateProducts(baseProducts: any[], count: number): any[] {
    const products = [];
    const usedIndices = new Set<number>(); // Para evitar productos repetidos
  
    while (products.length < count) {
      const randomIndex = Math.floor(Math.random() * baseProducts.length); // Índice aleatorio
      if (!usedIndices.has(randomIndex)) {
        usedIndices.add(randomIndex); // Evitar duplicados
        const baseProduct = baseProducts[randomIndex];
        products.push({
          ...baseProduct,
          affiliateLink: `${baseProduct.affiliateLink}?variante=${products.length + 1}`, // Crear enlaces únicos
        });
      }
    }
  
    return products;
  }
  
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { BannerComponent } from '../../shared/banner/banner.component'; // Importar el componente banner

/**
 * 📌 Componente `ProductListComponent`
 *
 * Este componente muestra una lista de productos organizados por categorías en la portada de la tienda online.
 * También selecciona productos recomendados aleatoriamente para destacar en la página principal de la tienda.
 *
 * ℹ️ **Uso:** Se utiliza en la vista de la tienda (`/products`) para mostrar categorías de productos y sugerencias destacadas.
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterModule, BannerComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css'],
})
export class ProductListComponent implements OnInit {
  /**
   * 📌 Lista de productos recomendados para mostrar en la tienda.
   * Se seleccionan aleatoriamente de todas las categorías disponibles.
   */
  recommendations: any[] = [];

  /**
   * 📌 Lista de categorías de productos.
   * Cada categoría contiene su nombre, imagen y una selección de productos.
   */
  categories: any[] = [];

  /**
   * Constructor del componente.
   * @param http - Servicio `HttpClient` para obtener los datos de los productos desde un archivo JSON.
   */
  constructor(private http: HttpClient) {}

  /**
   * 📌 Método `ngOnInit()`
   *
   * - Carga los datos de `assets/products.json`.
   * - Organiza los productos en categorías.
   * - Genera una selección de productos recomendados.
   */
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

  /**
   * 📌 Método `generateProducts()`
   *
   * - Selecciona un número específico de productos aleatorios de una lista base.
   * - Evita repetir productos usando un `Set` para controlar los índices ya utilizados.
   * - Modifica el enlace de afiliado para hacerlo único.
   *
   * @param baseProducts - Lista de productos de una categoría.
   * @param count - Cantidad de productos a seleccionar.
   * @returns Una lista de productos seleccionados aleatoriamente.
   */
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

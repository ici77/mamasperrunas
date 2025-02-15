import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerportadaComponent } from '../../components/bannerportada/bannerportada.component';
import { GridComponent } from '../../components/grid/grid.component';
import { CircleGridComponent } from '../../components/circle-grid/circle-grid.component';
import { BlogComponent } from '../../components/blog/blog.component';
import { CommunityComponent } from '../../components/community/community.component';

/**
 * 📌 `LandingPageComponent`
 *
 * Este es el **componente principal de la página de inicio**.  
 * Se encarga de estructurar la landing page, mostrando los principales elementos de la web.
 *
 * 🔹 **Componentes Importados:**
 * - `BannerportadaComponent`: Muestra un banner en la portada.
 * - `GridComponent`: Sección con cuadrícula de contenido.
 * - `CircleGridComponent`: Sección con elementos circulares (categorías).
 * - `BlogComponent`: Últimos artículos del blog.
 * - `CommunityComponent`: Muestra la comunidad y publicaciones recientes.
 *
 * ℹ️ **Uso:** Este componente se carga cuando el usuario accede a la página principal `/`.
 */
@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    BannerportadaComponent,
    GridComponent,
    CircleGridComponent,
    BlogComponent,
    CommunityComponent,
  ],
  template: `
    <app-bannerportada></app-bannerportada> <!-- Banner de la portada -->
    <div style="text-align: center; margin-top: 50px;">
      <app-grid></app-grid> <!-- Sección de cuadrícula -->
      <app-circle-grid></app-circle-grid> <!-- Grid con iconos circulares -->
      <app-blog></app-blog> <!-- Últimos posts del blog -->
      <app-community></app-community> <!-- Sección de comunidad -->
    </div>
  `,
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {
  /**
   * 📌 Componente de la página de inicio.
   * No contiene lógica adicional, solo estructura la UI de la landing page.
   */
}

import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * Componente para mostrar las noticias o novedades en la aplicación.
 * Este componente es un contenedor para mostrar una lista de noticias, aunque en este código actual no se han añadido datos.
 * 
 * @component
 * @example
 * <app-news></app-news>
 */
@Component({
  selector: 'app-news',
  standalone: true,
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  imports: [RouterModule, CommonModule] // Se añaden las importaciones necesarias
})
export class NewsComponent {
  // Este componente está preparado para mostrar noticias, aunque no contiene lógica de negocio por el momento
}

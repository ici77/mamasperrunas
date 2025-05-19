import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // Importamos RouterModule para routerLink

/**
 * 📌 Componente `GridComponent`
 *
 * Este componente representa una cuadrícula de tarjetas con enlaces a diferentes 
 * secciones de la aplicación. Se usa en la página principal para guiar a los 
 * usuarios hacia la Tienda Online, la Agenda de Eventos y los Servicios Especializados.
 */
@Component({
  selector: 'app-grid',
  standalone: true,
  imports: [CommonModule, RouterModule], // Se añade RouterModule para habilitar routerLink
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.css']
})
export class GridComponent {
  /**
   * 📌 Lista de elementos de la cuadrícula con título, imagen, descripción y ruta.
   */
  gridItems = [
    {
      title: 'Tienda Online',
      description: 'Encuentra los mejores productos para tu perro y siempre al mejor precio.',
      image: 'assets/images/landing/tienda.png',
      link: '/products'
    },
    {
      title: 'Agenda de Eventos',
      description: 'Descubre y participa en actividades para tu mascota.',
      image: 'assets/images/landing/eventos.png',
      link: '/eventos'
    },
    {
      title: 'Servicios ',
      description: 'Conoce todos los servicios pensados para ti y tu mascota.',
      image: 'assets/images/landing/servicios.png',
      link: '/services'
    }
  ];
}

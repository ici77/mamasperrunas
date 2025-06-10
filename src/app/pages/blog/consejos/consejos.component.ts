import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

/**
 * Componente que muestra una lista de consejos útiles para el cuidado de perros.
 * Cada consejo incluye un título, un resumen, una imagen y un enlace relacionado.
 * 
 * @component
 * @example
 * <app-consejos></app-consejos>
 */
@Component({
  selector: 'app-consejos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './consejos.component.html',
  styleUrls: ['./consejos.component.css']
})
export class ConsejosComponent {
  /** Lista de consejos que se mostrarán en el componente */
  consejos = [
    {
      /** Título del consejo */
      titulo: 'Cómo preparar a tu perro para el verano',
      
      /** Resumen del consejo */
      resumen: 'Consejos prácticos para evitar golpes de calor y cuidar su hidratación.',
      
      /** Ruta de la imagen del consejo */
      imagen: 'assets/images/consejos/verano.png',
      
      /** Enlace relacionado con el consejo */
      enlace: '#'
    },
    {
      titulo: '¿Qué meter en la maleta de tu perrhijo?',
      resumen: 'Consejos para que no se te olvide nada. Los imprescindibles.',
      imagen: 'assets/images/consejos/viaje.png',
      enlace: '#'
    },
    {
      titulo: '5 snacks naturales para perros',
      resumen: 'Ideas de premios saludables que puedes preparar en casa.',
      imagen: 'assets/images/consejos/snack.png',
      enlace: '#'
    },
    {
      titulo: 'Opinión: ¿Los perros deben dormir en la cama?',
      resumen: 'Una reflexión sobre los beneficios y límites del colecho con mascotas.',
      imagen: 'assets/images/consejos/cama.png',
      enlace: '#'
    },
  ];
}

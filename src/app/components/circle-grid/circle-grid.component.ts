import { Component } from '@angular/core'; 
import { CommonModule } from '@angular/common'; 

/**
 * 📌 Componente `CircleGridComponent`
 *
 * Este componente muestra una cuadrícula de íconos circulares con categorías 
 * relevantes para los dueños de mascotas, como parques caninos, veterinarias, 
 * tiendas de mascotas y cafeterías pet-friendly.
 *
 * ℹ️ **Uso:** Se utiliza en la página de inicio para proporcionar accesos rápidos 
 * a distintas secciones de la aplicación.
 */
@Component({
  selector: 'app-circle-grid',
  standalone: true,
  imports: [CommonModule], 
  templateUrl: './circle-grid.component.html',
  styleUrls: ['./circle-grid.component.css']
})
export class CircleGridComponent {
  /**
   * 📌 Lista de elementos que se mostrarán en la cuadrícula.
   * Cada objeto representa una categoría con su título y una imagen asociada.
   */
  items = [
    {
      title: 'Parques Caninos',
      image: 'assets/images/landing/parque.png'
    },
    {
      title: 'Veterinarias',
      image: 'assets/images/landing/veterinaria.png'
    },
    {
      title: 'Tiendas de Mascotas',
      image: 'assets/images/landing/tienda.png'
    },
    {
      title: 'Cafeterías Pet Friendly',
      image: 'assets/images/landing/cafeteria.png'
    }
  ];
}

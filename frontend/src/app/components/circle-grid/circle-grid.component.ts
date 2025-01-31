import { Component } from '@angular/core'; // Corrige la importación
import { CommonModule } from '@angular/common'; // Importa el módulo necesario para directivas como *ngFor

@Component({
  selector: 'app-circle-grid',
  standalone: true,
  imports: [CommonModule], // Importa CommonModule para que funcione *ngFor
  templateUrl: './circle-grid.component.html',
  styleUrls: ['./circle-grid.component.css']
})
export class CircleGridComponent {
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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogBreedsComponent } from '../../components/dog-breeds/dog-breeds.component';
import { BlogLayoutComponent } from '../../components/blog-layout/blog-layout.component'; // ✅ Importamos el layout del blog

/**
 * Componente para mostrar una lista de razas de perros.
 * Los perros se pueden mostrar en bloques de 8, y se permite ver más perros al hacer clic en el botón correspondiente.
 * 
 * @component
 * @example
 * <app-dog-list></app-dog-list>
 */
@Component({
  selector: 'app-dog-list',
  standalone: true,
  imports: [CommonModule, DogBreedsComponent, BlogLayoutComponent], // ✅ Añadir BlogLayoutComponent
  templateUrl: './dog-list.component.html',
  styleUrls: ['./dog-list.component.css']
})
export class DogListComponent {
  /** Lista completa de perros recibidos */
  dogs: any[] = [];

  /** Lista de perros filtrados para mostrar */
  filteredDogs: any[] = [];

  /** Número de perros a mostrar por defecto */
  dogsToShow = 8;

  /**
   * Método para recibir la lista de perros.
   * 
   * @param dogs - Array de perros recibidos
   */
  receiveDogs(dogs: any[]): void {
    if (dogs && dogs.length > 0) {
      this.dogs = [...dogs]; // Asigna la lista de perros
      this.updateDisplayedDogs(); // Actualiza los perros a mostrar
    }
  }

  /**
   * Método que actualiza la lista de perros a mostrar según el límite actual.
   * Muestra solo un número limitado de perros, según el valor de `dogsToShow`.
   */
  updateDisplayedDogs(): void {
    this.filteredDogs = this.dogs.slice(0, this.dogsToShow); // Muestra los primeros `dogsToShow` perros
  }

  /**
   * Método que aumenta el número de perros a mostrar en la lista.
   * Se muestra 8 perros más cada vez que se llama.
   */
  showMore(): void {
    if (this.dogsToShow < this.dogs.length) {
      this.dogsToShow += 8; // Aumenta el número de perros a mostrar
      this.updateDisplayedDogs(); // Actualiza los perros a mostrar
    }
  }
}

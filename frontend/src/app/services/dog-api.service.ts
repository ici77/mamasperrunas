import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogBreedsComponent } from '../../components/dog-breeds/dog-breeds.component';
import { BlogLayoutComponent } from '../../components/blog-layout/blog-layout.component'; // ✅ Importamos el layout del blog

/**
 * @component DogListComponent
 * @description Componente que muestra una lista de razas de perros.
 * 
 * - Recibe datos del componente `DogBreedsComponent`.
 * - Muestra una cantidad inicial de perros y permite cargar más con un botón.
 * - Integra `BlogLayoutComponent` para mantener la estructura del blog.
 * 
 * @selector app-dog-list
 * @standalone true
 * @imports CommonModule, DogBreedsComponent, BlogLayoutComponent
 */
@Component({
  selector: 'app-dog-list',
  standalone: true,
  imports: [CommonModule, DogBreedsComponent, BlogLayoutComponent], // ✅ Añadir BlogLayoutComponent
  templateUrl: './dog-list.component.html',
  styleUrls: ['./dog-list.component.css']
})
export class DogListComponent {
  
  /**
   * @property {any[]} dogs - Lista completa de razas de perros.
   */
  dogs: any[] = [];

  /**
   * @property {any[]} filteredDogs - Lista de perros filtrados que se muestran en pantalla.
   */
  filteredDogs: any[] = [];

  /**
   * @property {number} dogsToShow - Número inicial de perros a mostrar.
   */
  dogsToShow = 8;

  /**
   * @method receiveDogs
   * @description Recibe la lista de perros desde `DogBreedsComponent` y la almacena localmente.
   * @param {any[]} dogs - Lista de razas de perros recibida.
   */
  receiveDogs(dogs: any[]): void {
    if (dogs && dogs.length > 0) {
      this.dogs = [...dogs];
      this.updateDisplayedDogs();
    }
  }

  /**
   * @method updateDisplayedDogs
   * @description Actualiza la lista de perros mostrados en pantalla, aplicando el límite `dogsToShow`.
   */
  updateDisplayedDogs(): void {
    this.filteredDogs = this.dogs.slice(0, this.dogsToShow);
  }

  /**
   * @method showMore
   * @description Incrementa la cantidad de perros mostrados en pantalla de 8 en 8.
   */
  showMore(): void {
    if (this.dogsToShow < this.dogs.length) {
      this.dogsToShow += 8;
      this.updateDisplayedDogs();
    }
  }
}

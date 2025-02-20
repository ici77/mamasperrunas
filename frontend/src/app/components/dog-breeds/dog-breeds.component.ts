import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogApiService } from '../../services/dog-api.service';

/**
 * @interface Dog
 * @description Interfaz que representa una raza de perro.
 * @property {string} name - Nombre de la raza.
 * @property {string} image - URL de la imagen de la raza.
 * @property {string} temperament - Temperamento del perro.
 * @property {string} origin - País de origen de la raza.
 * @property {string} weight - Peso de la raza en kg.
 * @property {number} [avgWeight] - Peso medio calculado para facilitar filtros.
 */
interface Dog {
  name: string;
  image: string;
  temperament: string;
  origin: string;
  weight: string;
  avgWeight?: number;
}

/**
 * @component DogBreedsComponent
 * @description Componente que muestra un listado de razas de perros obtenidas desde una API.
 * 
 * - Obtiene datos desde `DogApiService`.
 * - Filtra los perros según su tamaño.
 * - Emite eventos para compartir datos con otros componentes.
 * 
 * @selector app-dog-breeds
 * @standalone true
 * @imports CommonModule
 */
@Component({
  selector: 'app-dog-breeds',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dog-breeds.component.html',
  styleUrls: ['./dog-breeds.component.css']
})
export class DogBreedsComponent implements OnInit {
  /**
   * @property {Dog[]} dogBreeds - Lista completa de razas de perros.
   */
  dogBreeds: Dog[] = [];

  /**
   * @property {Dog[]} displayedDogs - Lista filtrada de perros a mostrar.
   */
  displayedDogs: Dog[] = [];

  /**
   * @property {number} dogsToShow - Número inicial de perros a mostrar.
   */
  dogsToShow = 8;

  /**
   * @property {string} selectedSize - Filtro de tamaño de los perros.
   * - Valores posibles: `'all' | 'mini' | 'small' | 'medium' | 'large' | 'giant'`
   */
  selectedSize: string = 'all';

  /**
   * @event sendDogs - Evento que emite la lista filtrada de perros a otros componentes.
   */
  @Output() sendDogs = new EventEmitter<Dog[]>();

  /**
   * @constructor
   * @param {DogApiService} dogApiService - Servicio para obtener razas de perros desde la API.
   */
  constructor(private dogApiService: DogApiService) {}

  /**
   * @method ngOnInit
   * @description Método de inicialización del componente.
   * - Llama al servicio `DogApiService` para obtener las razas de perros.
   * - Procesa los datos, calcula el peso medio y carga los primeros 8 perros.
   */
  ngOnInit(): void {
    this.dogApiService.getDogBreeds().subscribe(
      (data: any[]) => {
        this.dogBreeds = data.map((dog) => ({
          ...dog,
          image: dog.image ? dog.image.url : 'https://via.placeholder.com/150',
          weight: dog.weight?.metric || 'No disponible',
          avgWeight: this.calculateAverageWeight(dog.weight?.metric)
        }));
        this.updateDisplayedDogs();
      },
      (error) => {
        console.error('Error al obtener las razas de perros', error);
      }
    );
  }
  
  /**
   * @method showMore
   * @description Muestra más perros al usuario (incrementando de 8 en 8).
   */
  showMore(): void {
    if (this.dogsToShow < this.dogBreeds.length) {
      this.dogsToShow += 8;
      this.updateDisplayedDogs();
    }
  }
  
  /**
   * @method updateDisplayedDogs
   * @description Filtra y actualiza la lista de perros a mostrar según el tamaño seleccionado.
   * También emite la lista de perros filtrada a otros componentes.
   */
  updateDisplayedDogs(): void {
    let filteredDogs = this.dogBreeds;
  
    if (this.selectedSize !== 'all') {
      filteredDogs = this.dogBreeds.filter(dog => {
        const weight = dog.avgWeight || 0;
        return this.sizeFilter(weight);
      });
    }
  
    this.displayedDogs = filteredDogs.slice(0, this.dogsToShow);
    this.sendDogs.emit(filteredDogs);
  }
  
  /**
   * @method calculateAverageWeight
   * @description Calcula el peso medio de un perro a partir de un rango.
   * @param {string} weight - Rango de peso en formato `"x - y"` (ejemplo: `"5 - 10"`).
   * @returns {number} Peso medio calculado.
   */
  private calculateAverageWeight(weight: string): number {
    if (typeof weight !== 'string') return 0;
    const weightParts = weight.split(' - ').map(w => parseFloat(w.trim()));
    return (weightParts.length === 2 && !isNaN(weightParts[0]) && !isNaN(weightParts[1]))
      ? (weightParts[0] + weightParts[1]) / 2
      : 0;
  }

  /**
   * @method sizeFilter
   * @description Aplica el filtro de tamaño según el peso promedio de la raza.
   * @param {number} weight - Peso medio del perro.
   * @returns {boolean} `true` si el perro pertenece al tamaño filtrado, `false` en caso contrario.
   */
  sizeFilter(weight: number): boolean {
    switch (this.selectedSize) {
      case 'mini': return weight >= 1 && weight <= 6;
      case 'small': return weight >= 5 && weight <= 25;
      case 'medium': return weight >= 14 && weight <= 27;
      case 'large': return weight >= 21 && weight <= 39;
      case 'giant': return weight >= 34 && weight <= 82;
      default: return true;
    }
  }

  /**
   * @method onSizeChange
   * @description Maneja el cambio de filtro de tamaño y actualiza la lista de perros.
   * @param {Event} event - Evento de selección del usuario.
   */
  onSizeChange(event: Event): void {
    const selectedValue = (event.target as HTMLSelectElement).value;
    this.selectedSize = selectedValue;
    this.dogsToShow = 8; 
    this.updateDisplayedDogs();
  }
}

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DogBreedsComponent } from '../../components/dog-breeds/dog-breeds.component';
import { BlogLayoutComponent } from '../../components/blog-layout/blog-layout.component'; // ✅ Importamos el layout del blog

@Component({
  selector: 'app-dog-list',
  standalone: true,
  imports: [CommonModule, DogBreedsComponent, BlogLayoutComponent], // ✅ Añadir BlogLayoutComponent
  templateUrl: './dog-list.component.html',
  styleUrls: ['./dog-list.component.css']
})
export class DogListComponent {
  dogs: any[] = [];
  filteredDogs: any[] = [];
  dogsToShow = 8;

  receiveDogs(dogs: any[]): void {
    if (dogs && dogs.length > 0) {
      this.dogs = [...dogs];
      this.updateDisplayedDogs();
    }
  }

  updateDisplayedDogs(): void {
    this.filteredDogs = this.dogs.slice(0, this.dogsToShow);
  }

  showMore(): void {
    if (this.dogsToShow < this.dogs.length) {
      this.dogsToShow += 8;
      this.updateDisplayedDogs();
    }
  }
}

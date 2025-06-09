import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-circle-grid',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './circle-grid.component.html',
  styleUrls: ['./circle-grid.component.css']
})
export class CircleGridComponent {
  /**
   * 📌 Lista de elementos que se mostrarán en la cuadrícula.
   */
  items = [
    {
      title: 'Parques Caninos',
      image: 'assets/images/landing/parque.png',
      tipo: 'parque para perros'
    },
    {
      title: 'Veterinarias',
      image: 'assets/images/landing/veterinaria.png',
      tipo: 'veterinario'
    },
    {
      title: 'Tiendas de Mascotas',
      image: 'assets/images/landing/tienda.png',
      tipo: 'tienda de mascotas'
    },
    {
      title: 'Cafeterías Pet Friendly',
      image: 'assets/images/landing/cafeteria.png',
      tipo: 'cafetería dog friendly'
    }
  ];

  /**
   * 📌 Objeto para almacenar los filtros seleccionados desde el formulario.
   */
  filtro = {
    tipo: '',
    provincia: ''
  };

  constructor(private router: Router) {}

  /**
   * 🔍 Redirige a la página de localización con los filtros aplicados.
   */
  buscarDesdeInicio(): void {
    const queryParams: any = {};

    // ✅ Solo incluir tipo si está definido
    if (this.filtro.tipo) {
      queryParams.tipo = this.filtro.tipo;
    }

    // ✅ Determinar si se ha seleccionado provincia
    if (this.filtro.provincia && this.filtro.provincia.trim() !== '') {
      queryParams.provincia = this.filtro.provincia;
      queryParams.ubicacion = 'provincia';
    } else {
      queryParams.ubicacion = 'miUbicacion';
    }

    // ✅ Redirigir con los parámetros construidos
    this.router.navigate(['/localizacion'], { queryParams });
  }
  irADetalle(tipo: string): void {
  this.router.navigate(['/localizacion'], {
    queryParams: {
      tipo,
      ubicacion: 'miUbicacion'
    }
  });
}

}

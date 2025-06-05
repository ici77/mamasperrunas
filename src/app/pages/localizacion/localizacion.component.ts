import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // ✅ Import necesario para [(ngModel)]

declare const google: any;

@Component({
  selector: 'app-localizacion',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule // ✅ Añadido aquí
  ],
  templateUrl: './localizacion.component.html',
  styleUrls: ['./localizacion.component.scss']
})
export class LocalizacionComponent implements OnInit {

  modoUbicacion = 'miUbicacion';
  provinciaSeleccionada: string = '';

  provincias: string[] = [
    'Sevilla', 'Madrid', 'Barcelona', 'Valencia', 'Málaga',
    'Cádiz', 'Granada', 'Zaragoza', 'Bilbao'
  ];

  tiposLugares = [
    { nombre: 'Veterinarios', keyword: 'veterinario', seleccionado: true },
    { nombre: 'Protectoras', keyword: 'protectoras de animales', seleccionado: true },
    { nombre: 'Tiendas de animales', keyword: 'tienda de mascotas', seleccionado: false },
    { nombre: 'Parques para perros', keyword: 'parque para perros', seleccionado: false },
    { nombre: 'Residencias caninas', keyword: 'residencia canina', seleccionado: false },
    { nombre: 'Adiestradores', keyword: 'adiestrador de perros', seleccionado: false },
    { nombre: 'Cafeterías dog-friendly', keyword: 'cafetería dog friendly', seleccionado: false },
    { nombre: 'Peluquerías caninas', keyword: 'peluquería canina', seleccionado: false }
  ];

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const map = new google.maps.Map(document.getElementById('map'), {
            center: userLocation,
            zoom: 14
          });

          new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "¡Estás aquí!"
          });
        },
        () => {
          this.showDefaultMap();
        }
      );
    } else {
      this.showDefaultMap();
    }
  }

  showDefaultMap(): void {
    const sevilla = { lat: 37.3891, lng: -5.9845 };
    const map = new google.maps.Map(document.getElementById('map'), {
      center: sevilla,
      zoom: 12
    });
  }
}

import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

declare const google: any;

@Component({
  selector: 'app-localizacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './localizacion.component.html',
  styleUrls: ['./localizacion.component.scss']
})
export class LocalizacionComponent implements OnInit {

  modoUbicacion = 'miUbicacion';
  provinciaSeleccionada: string = '';
  mapa: any;
  marcadores: any[] = [];
  lugaresMostrados: any[] = [];

  provincias: string[] = [
    'Sevilla', 'Madrid', 'Barcelona', 'Valencia', 'Málaga',
    'Cádiz', 'Granada', 'Zaragoza', 'Bilbao'
  ];

  tiposLugares = [
    { nombre: 'Veterinarios', keyword: 'veterinario', seleccionado: true },
    { nombre: 'Protectoras', keyword: 'protectoras de animales', seleccionado: true },
    { nombre: 'Tiendas de animales', keyword: 'tienda de mascotas', seleccionado: false },
    { nombre: 'Parques para perros', keyword: 'parque para perros', seleccionado: false },
    { nombre: 'Residencias caninas', keyword: 'guarderia canina', seleccionado: false },
    { nombre: 'Adiestradores', keyword: 'adiestrador de perros', seleccionado: false },
    { nombre: 'Cafeterías dog-friendly', keyword: 'cafetería dog friendly', seleccionado: false },
    { nombre: 'Peluquerías caninas', keyword: 'peluquería canina', seleccionado: false }
  ];

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    const mapElement = document.getElementById('map');
    if (!mapElement) return;

    if (this.modoUbicacion === 'provincia') {
      this.buscarPorProvincia();
      return;
    }

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const ubicacion = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          this.cargarMapa(ubicacion);
        },
        () => {
          alert("No se pudo obtener la ubicación. Selecciona una provincia.");
        }
      );
    }
  }

  cargarMapa(centro: any): void {
    this.mapa = new google.maps.Map(document.getElementById('map'), {
      center: centro,
      zoom: 13
    });

    new google.maps.Marker({
      position: centro,
      map: this.mapa,
      title: 'Ubicación seleccionada'
    });

    this.buscarLugares(centro);
  }

  buscarPorProvincia(): void {
    if (!this.provinciaSeleccionada) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.provinciaSeleccionada }, (result: any, status: any) => {
      if (status === 'OK') {
        const ubicacion = result[0].geometry.location;
        this.cargarMapa(ubicacion);
      } else {
        console.error('No se pudo encontrar la provincia:', status);
      }
    });
  }

  buscarLugares(centro: any): void {
    const servicio = new google.maps.places.PlacesService(this.mapa);
    this.borrarMarcadores();
    this.lugaresMostrados = [];

    const tiposSeleccionados = this.tiposLugares.filter(t => t.seleccionado);
    const lugaresTemp: any[] = [];
    let tiposProcesados = 0;

    tiposSeleccionados.forEach(tipo => {
      const request = {
        location: centro,
        radius: 4000,
        keyword: tipo.keyword
      };

      servicio.nearbySearch(request, (resultados: any[], status: any) => {
        if (status === google.maps.places.PlacesServiceStatus.OK) {
          lugaresTemp.push(...resultados);
        }

        tiposProcesados++;
        if (tiposProcesados === tiposSeleccionados.length) {
          const finales = lugaresTemp.slice(0, 8); // 👉 solo 8 resultados

          finales.forEach((lugar: any) => {
            this.lugaresMostrados.push({
              nombre: lugar.name,
              direccion: lugar.vicinity || 'Dirección no disponible',
              fotoUrl: lugar.photos?.[0]?.getUrl() ?? 'assets/images/servicios/default.png',
              enlaceMaps: `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(lugar.name)}`
            });

            const marcador = new google.maps.Marker({
              position: lugar.geometry.location,
              map: this.mapa,
              title: lugar.name
            });

            this.marcadores.push(marcador);
          });
        }
      });
    });
  }

  buscar(): void {
    this.lugaresMostrados = [];
    this.initMap();
  }

  borrarMarcadores(): void {
    this.marcadores.forEach(m => m.setMap(null));
    this.marcadores = [];
  }

  seleccionarUnicoTipo(tipo: any): void {
    this.tiposLugares.forEach(t => t.seleccionado = false);
    tipo.seleccionado = true;
    this.buscar();
  }

  tarjetasInformativas = [
    {
      titulo: '¿Cómo participar?',
      imagen: 'quedadas.jpeg',
      descripcion: 'Descubre cómo formar parte de los eventos caninos.',
      link: '/eventos',
      boton: 'Ver más'
    },
    {
      titulo: 'Únete a la comunidad',
      imagen: 'comunidad.png',
      descripcion: 'Regístrate y accede a todos los beneficios.',
      link: '/registro',
      boton: 'Registrarse'
    },
    {
      titulo: 'Eventos solidarios',
      imagen: 'solidarios.png',
      descripcion: 'Apoya causas benéficas y de ayuda animal.',
      link: '/eventos',
      boton: 'Ver solidarios'
    }
  ];

  getImagenUrl(imagenUrl: string): string {
    if (!imagenUrl || imagenUrl.trim() === '') {
      return 'assets/images/eventos/default.jpg';
    }
    if (imagenUrl.startsWith('http') || imagenUrl.startsWith('assets/')) {
      return imagenUrl;
    }
    if (imagenUrl.startsWith('uploads/') || imagenUrl.startsWith('/uploads/')) {
      return 'https://backmp-production.up.railway.app/' + imagenUrl.replace(/^\/?/, '');
    }
    return 'assets/images/eventos/' + imagenUrl;
  }
}

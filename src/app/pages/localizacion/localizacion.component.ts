import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule, ActivatedRoute } from '@angular/router';

declare const google: any;

/**
 * Componente para mostrar un mapa interactivo con la posibilidad de buscar lugares relacionados con perros
 * como veterinarios, tiendas de mascotas, parques para perros, entre otros.
 * Los usuarios pueden buscar por su ubicación actual o por provincia.
 * 
 * @component
 * @example
 * <app-localizacion></app-localizacion>
 */

@Component({
  selector: 'app-localizacion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './localizacion.component.html',
  styleUrls: ['./localizacion.component.css']
})
export class LocalizacionComponent implements OnInit {

  modoUbicacion = 'miUbicacion';
  provinciaSeleccionada: string = '';
  mapa: any;
  marcadores: any[] = [];
  lugaresMostrados: any[] = [];

  constructor(private route: ActivatedRoute) {}
   /** Lista de provincias disponibles para buscar */

  provincias: string[] = [
    'Sevilla', 'Madrid', 'Barcelona', 'Valencia', 'Málaga',
    'Cádiz', 'Granada', 'Zaragoza', 'Bilbao'
  ];

  /** Tipos de lugares relacionados con perros disponibles para buscar */

  tiposLugares = [
    { nombre: 'Veterinarios', keyword: 'veterinario', seleccionado: false },
    { nombre: 'Protectoras', keyword: 'protectoras de animales', seleccionado: false },
    { nombre: 'Tiendas de animales', keyword: 'tienda de mascotas', seleccionado: false },
    { nombre: 'Parques para perros', keyword: 'parque para perros', seleccionado: false },
    { nombre: 'Residencias caninas', keyword: 'guarderia canina', seleccionado: false },
    { nombre: 'Adiestradores', keyword: 'adiestrador de perros', seleccionado: false },
    { nombre: 'Cafeterías dog-friendly', keyword: 'cafetería dog friendly', seleccionado: false },
    { nombre: 'Peluquerías caninas', keyword: 'peluquería canina', seleccionado: false }
  ];

   /** Tarjetas informativas para mostrar en la interfaz */

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

    /**
   * Método que se ejecuta al inicializar el componente.
   * Obtiene los parámetros de la URL para configurar el modo de ubicación y los filtros de búsqueda.
   */

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      const tipo = params['tipo'];
      const provincia = params['provincia'];
      const ubicacion = params['ubicacion'];

      if (tipo) {
        this.tiposLugares.forEach(t => {
          t.seleccionado = (t.keyword === tipo);
        });
      }

      if (provincia) {
        this.provinciaSeleccionada = provincia;
      }

      if (ubicacion === 'provincia') {
        this.modoUbicacion = 'provincia';
      }

      this.buscar();
    });
  }
/**
   * Método para iniciar la búsqueda de lugares.
   * Dependiendo del modo de ubicación seleccionado, busca por ubicación actual o por provincia.
   */
  buscar(): void {
    this.lugaresMostrados = [];
    this.borrarMarcadores();

    if (this.modoUbicacion === 'provincia') {
      this.buscarPorProvincia();
    } else {
      this.buscarUbicacionActual();
    }
  }

  buscarUbicacionActual(): void {
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

  buscarPorProvincia(): void {
    if (!this.provinciaSeleccionada) return;

    const geocoder = new google.maps.Geocoder();
    geocoder.geocode({ address: this.provinciaSeleccionada }, (results: any[], status: any) => {
      if (status === 'OK' && results.length > 0) {
        const ubicacion = results[0].geometry.location;
        this.cargarMapa(ubicacion);
      } else {
        console.error('Error al geocodificar la provincia:', this.provinciaSeleccionada, status);
        alert('No se pudo encontrar la provincia seleccionada. Prueba otra.');
      }
    });
  }

  cargarMapa(centro: any): void {
    const mapEl = document.getElementById('map');
    if (!mapEl) return;

    if (!this.mapa) {
      this.mapa = new google.maps.Map(mapEl, {
        center: centro,
        zoom: 13
      });
    } else {
      this.mapa.setCenter(centro);
      this.mapa.setZoom(13);
    }

    new google.maps.Marker({
      position: centro,
      map: this.mapa,
      title: 'Ubicación seleccionada'
    });

    this.buscarLugares(centro);
  }

  buscarLugares(centro: any): void {
    const servicio = new google.maps.places.PlacesService(this.mapa);
    this.borrarMarcadores();
    this.lugaresMostrados = [];

    const tiposSeleccionados = this.tiposLugares.filter(t => t.seleccionado);
    if (tiposSeleccionados.length === 0) return;

    const maxTotal = 6;
    const maxPorTipo = Math.floor(maxTotal / tiposSeleccionados.length);
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
          const recortados = resultados.slice(0, maxPorTipo);
          lugaresTemp.push(...recortados);
        }

        tiposProcesados++;
        if (tiposProcesados === tiposSeleccionados.length) {
          lugaresTemp.slice(0, maxTotal).forEach((lugar: any) => {
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

  borrarMarcadores(): void {
    this.marcadores.forEach(m => m.setMap(null));
    this.marcadores = [];
  }

  seleccionarUnicoTipo(tipo: any): void {
    this.tiposLugares.forEach(t => t.seleccionado = false);
    tipo.seleccionado = true;
    this.buscar();
  }

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

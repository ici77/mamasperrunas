import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { RouterModule, Router } from '@angular/router';
import { EventService, Evento } from '../../services/event.service';
import esLocale from '@fullcalendar/core/locales/es';

/**
 * Componente que muestra un calendario con los eventos programados.
 * El calendario permite visualizar eventos por mes y navegar a la vista detallada de un evento al hacer clic en él.
 * 
 * @component
 * @example
 * <app-calendario-eventos></app-calendario-eventos>
 */
@Component({
  standalone: true,
  selector: 'app-calendario-eventos',
  imports: [CommonModule, RouterModule, FullCalendarModule],
  templateUrl: './calendario-eventos.component.html',
  styleUrls: ['./calendario-eventos.component.css']
})
export class CalendarioEventosComponent implements OnInit {

  /** Configuración inicial del calendario */
  calendarOptions: any = {
    plugins: [dayGridPlugin], // Plugin para vista de mes
    initialView: 'dayGridMonth', // Vista inicial (mes)
    locale: esLocale,  // Idioma del calendario
    events: [],  // Lista de eventos para mostrar en el calendario
    eventClick: this.onEventClick.bind(this), // Función llamada al hacer clic en un evento
    height: 'auto', // Altura del calendario
  };

  /** Lista de eventos recomendados que se mostrarán en tarjetas */
  eventosRecomendados: Evento[] = [];

  /**
   * Constructor para inicializar el servicio de eventos y el enrutador.
   * 
   * @param eventService - Servicio para manejar las operaciones de eventos
   * @param router - Enrutador para navegar entre las vistas
   */
  constructor(
    private eventService: EventService,
    private router: Router
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente. Carga los eventos desde el servicio.
   */
  ngOnInit(): void {
    this.cargarEventos();
  }

  /**
   * Carga los eventos desde el servicio y los asigna al calendario y a la lista de eventos recomendados.
   */
  cargarEventos(): void {
    this.eventService.getTodos().subscribe((eventos: Evento[]) => {
      // 🔹 Cargar eventos en el calendario
      this.calendarOptions.events = eventos.map(evento => ({
        title: evento.titulo, // Título del evento
        start: evento.fecha,  // Fecha de inicio (formato ISO)
        url: `/evento/${evento.id}`,  // Enlace a la página del evento
        color: evento.destacado ? '#e67b11' : '#3B8024'  // Color según si es destacado
      }));

      // 🔹 Cargar 3 eventos aleatorios para las tarjetas
      this.eventosRecomendados = eventos
        .filter(e => !!e.imagenUrl)  // Filtrar eventos con imagen
        .sort(() => 0.5 - Math.random())  // Aleatorizar el orden
        .slice(0, 3);  // Tomar los primeros 3
    });
  }

  /**
   * Redirige al usuario a la página del evento al hacer clic sobre él.
   * 
   * @param arg - Argumento con los detalles del evento clicado
   */
  onEventClick(arg: any): void {
    if (arg.event.url) {
      arg.jsEvent.preventDefault();
      this.router.navigateByUrl(arg.event.url);  // Redirigir al evento
    }
  }

  /**
   * Obtiene la URL de la imagen del evento.
   * 
   * @param imagenUrl - URL de la imagen del evento
   * @returns La URL completa de la imagen
   */
  getImagenUrl(imagenUrl: string): string {
    if (!imagenUrl || imagenUrl.trim() === '') {
      return 'assets/images/eventos/default.jpg';  // Imagen por defecto si no tiene imagen
    }

    if (imagenUrl.startsWith('http') || imagenUrl.startsWith('assets/')) {
      return imagenUrl;  // Si la URL es completa o relativa a assets, la retorna tal cual
    }

    if (imagenUrl.startsWith('uploads/') || imagenUrl.startsWith('/uploads/')) {
      return 'https://backmp-production.up.railway.app/' + imagenUrl.replace(/^\/?/, '');  // Ruta base para imágenes subidas
    }

    return 'assets/images/eventos/' + imagenUrl;  // Ruta relativa para imágenes
  }
}

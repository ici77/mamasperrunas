import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import { RouterModule, Router } from '@angular/router';
import { EventService, Evento } from '../../services/event.service';
import esLocale from '@fullcalendar/core/locales/es';


@Component({
  standalone: true,
  selector: 'app-calendario-eventos',
  imports: [CommonModule, RouterModule, FullCalendarModule],
  templateUrl: './calendario-eventos.component.html',
  styleUrls: ['./calendario-eventos.component.css']
})
export class CalendarioEventosComponent implements OnInit {

  calendarOptions: any = {
    plugins: [dayGridPlugin],
    initialView: 'dayGridMonth',
    locale: esLocale, 
    events: [],
    eventClick: this.onEventClick.bind(this),
    height: 'auto',
    
  };

  eventosRecomendados: Evento[] = [];

  constructor(
    private eventService: EventService,
    private router: Router
  ) {}
  

  ngOnInit(): void {
    this.cargarEventos();
  }

  cargarEventos(): void {
    this.eventService.getTodos().subscribe((eventos: Evento[]) => {
      // 🔹 Cargar eventos en el calendario
      this.calendarOptions.events = eventos.map(evento => ({
        title: evento.titulo,
        start: evento.fecha,  // formato ISO
        url: `/evento/${evento.id}`,
        color: evento.destacado ? '#e67b11' : '#3B8024'
      }));

      // 🔹 Cargar 4 aleatorios para las tarjetas
      this.eventosRecomendados = eventos
        .filter(e => !!e.imagenUrl)
        .sort(() => 0.5 - Math.random())
        .slice(0, 3);
    });
  }

  onEventClick(arg: any): void {
    if (arg.event.url) {
      arg.jsEvent.preventDefault();
      this.router.navigateByUrl(arg.event.url);
    }
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

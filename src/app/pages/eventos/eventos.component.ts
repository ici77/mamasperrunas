import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EventService, Evento } from '../../services/event.service';

/**
 * Componente para mostrar la lista de eventos disponibles.
 * Permite filtrar los eventos por tipo, por si son de pago o gratuitos,
 * y si son destacados. Además, permite apuntarse a un evento si el usuario está autenticado.
 * 
 * @component
 * @example
 * <app-eventos></app-eventos>
 */
@Component({
  standalone: true,
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class EventosComponent implements OnInit {
  /** Lista de eventos */
  eventos: Evento[] = [];

  /** Lista de eventos destacados */
  eventosDestacados: Evento[] = [];

  /** Tipo de evento seleccionado para filtrar */
  tipoSeleccionado: string = '';

  /** Filtro para los eventos de pago */
  esDePagoSeleccionado: string = 'todos';

  /** Filtro para eventos destacados */
  soloDestacados: boolean = false;

  /** Estado de si el usuario está autenticado */
  isLoggedIn: boolean = false;

  /** ID del usuario autenticado */
  userId: number | null = null;

  /** Categorías disponibles para los eventos */
  categorias = [
    { tipo: 'celebraciones', nombre: ' Celebraciones', descripcion: 'Fiestas y aniversarios perrunos', imagen: 'celebraciones.png' },
    { tipo: 'concursos', nombre: ' Concursos', descripcion: 'Competiciones y talentos caninos', imagen: 'concurso.png' },
    { tipo: 'solidarios', nombre: ' Solidarios', descripcion: 'Eventos benéficos y de ayuda', imagen: 'solidarios.png' },
    { tipo: 'talleres', nombre: ' Talleres', descripcion: 'Aprende y diviértete con tu mascota', imagen: 'talleres.png' },
    { tipo: 'quedadas', nombre: ' Quedadas', descripcion: 'Paseos, grupos y socialización', imagen: 'quedadas.jpeg' },
    { tipo: 'miscelanea', nombre: ' Miscelánea', descripcion: 'Otros eventos y actividades variadas', imagen: 'miscelanea.png' }
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
   * Constructor para inicializar el servicio de eventos, las rutas activas y el enrutador.
   * 
   * @param eventService - Servicio para manejar los eventos
   * @param route - Activador de rutas para acceder a los parámetros de la URL
   * @param router - Enrutador para navegar entre las vistas
   */
  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Carga los eventos destacados y los eventos filtrados según los parámetros de la URL.
   */
  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
    this.userId = this.getUserIdFromToken();

    this.cargarEventosDestacados();

    this.route.queryParams.subscribe(params => {
      if (params['tipo']) {
        this.tipoSeleccionado = params['tipo'];
      }
      this.filtrarEventos();
    });
  }

  /**
   * Método que resetea los filtros de eventos y redirige al componente de eventos sin filtros aplicados.
   */
  verTodosEventos(): void {
    this.tipoSeleccionado = '';
    this.esDePagoSeleccionado = 'todos';
    this.soloDestacados = false;

    this.router.navigate([], {
      relativeTo: this.route,
      queryParams: {},
      queryParamsHandling: ''
    });

    this.filtrarEventos();
  }

  /**
   * Carga los eventos destacados desde el backend y obtiene el conteo de asistentes para cada evento.
   */
  cargarEventosDestacados(): void {
    this.eventService.getDestacados().subscribe(eventos => {
      this.eventService.getConteoApuntados().subscribe(conteo => {
        this.eventosDestacados = eventos.map(evento => ({
          ...evento,
          apuntados: conteo[evento.id] || 0
        }));
      });
    });
  }

  /**
   * Filtra los eventos según el tipo, si son de pago, y si son destacados.
   */
  filtrarEventos(): void {
    const tipo = this.tipoSeleccionado || '';
    const pago = this.esDePagoSeleccionado || 'todos';
    const destacado = this.soloDestacados;

    this.eventService.buscarEventos(tipo, pago, destacado).subscribe(eventos => {
      console.log('🖼 Eventos recibidos:', eventos); // 👈 Añadido aquí
      this.eventService.getConteoApuntados().subscribe(conteo => {
        this.eventos = eventos.map(evento => ({
          ...evento,
          apuntados: conteo[evento.id] || 0
        }));
      });
    });
  }

  /**
   * Permite al usuario apuntarse a un evento.
   * Si el usuario no está autenticado, lo redirige a la página de inicio de sesión.
   * 
   * @param evento - El evento al que el usuario desea apuntarse
   */
  apuntarse(evento: Evento): void {
    if (!this.isLoggedIn) {
      this.irALogin();
      return;
    }

    this.eventService.apuntarseAEvento(evento).subscribe({
      next: (res) => {
        evento.yaInscrito = true;
        evento.apuntados = (evento.apuntados || 0) + 1;
        alert(res.mensaje); // ← mensaje del backend
      },
      error: (err) => {
        console.error('❌ Error al apuntarse:', err);
        alert('⚠️ Ocurrió un error al apuntarte. Revisa tu conexión o inicia sesión de nuevo.');
      }
    });
  }

  /**
   * Redirige al usuario a la página para crear un nuevo evento.
   */
  irACrearEvento(): void {
    this.router.navigate(['/crear-evento']);
  }

  /**
   * Redirige al usuario a la página de inicio de sesión.
   */
  irALogin(): void {
    this.router.navigate(['/login']);
  }

  /**
   * Filtra los eventos por categoría.
   * 
   * @param tipo - El tipo de categoría para filtrar los eventos
   */
  filtrarPorCategoria(tipo: string): void {
    this.tipoSeleccionado = tipo;
    this.filtrarEventos();
  }

  /**
   * Obtiene el ID del usuario desde el token JWT almacenado en localStorage.
   * 
   * @returns El ID del usuario o null si no se encuentra el token
   */
  private getUserIdFromToken(): number | null {
    try {
      const token = localStorage.getItem('auth_token');
      if (!token) return null;

      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload?.id || null;
    } catch (e) {
      return null;
    }
  }

  /**
   * Obtiene la URL completa de la imagen del evento.
   * 
   * @param imagenUrl - URL de la imagen
   * @returns La URL completa de la imagen, si no tiene, devuelve la ruta por defecto
   */
  getImagenUrl(imagenUrl: string): string {
    if (!imagenUrl || imagenUrl.trim() === '') {
      return 'assets/images/eventos/default.jpg';
    }

    // ✅ Si ya es una URL completa o assets/
    if (imagenUrl.startsWith('http') || imagenUrl.startsWith('assets/')) {
      return imagenUrl;
    }

    // ✅ Si es una ruta del backend
    if (imagenUrl.startsWith('uploads/') || imagenUrl.startsWith('/uploads/')) {
      return 'https://backmp-production.up.railway.app/' + imagenUrl.replace(/^\/?/, '');
    }

    // ✅ Si es un nombre de imagen del frontend (por ejemplo "quedadas.jpeg")
    return 'assets/images/eventos/' + imagenUrl;
  }
}

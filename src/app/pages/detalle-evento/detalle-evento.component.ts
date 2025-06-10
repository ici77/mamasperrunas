import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService, Evento } from '../../services/event.service';
import { environment } from '../../../environments/environment';

/**
 * Componente para mostrar los detalles de un evento, incluyendo la información del evento,
 * la lista de asistentes y la posibilidad de que el usuario se apunte al evento.
 * 
 * @component
 * @example
 * <app-detalle-evento></app-detalle-evento>
 */
@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DetalleEventoComponent implements OnInit {
  /** Información del evento */
  evento: Evento | null = null;

  /** Estado de si el usuario está autenticado */
  isLoggedIn: boolean = false;

  /** Resumen de los asistentes al evento */
  asistentesResumen: string = '';

  /** Lista de nombres de los asistentes al evento */
  asistentesNombres: string[] = [];

  /** Categorías disponibles para los eventos */
  categorias = [
    { tipo: 'celebraciones', nombre: ' Celebraciones', descripcion: 'Fiestas y aniversarios perrunos', imagen: 'uploads/celebraciones.png' },
    { tipo: 'concursos', nombre: ' Concursos', descripcion: 'Competiciones y talentos caninos', imagen: 'uploads/concurso.png' },
    { tipo: 'solidarios', nombre: ' Solidarios', descripcion: 'Eventos benéficos y de ayuda', imagen: 'uploads/solidarios.png' },
    { tipo: 'talleres', nombre: ' Talleres', descripcion: 'Aprende y diviértete con tu mascota', imagen: 'uploads/talleres.png' },
    { tipo: 'quedadas', nombre: ' Quedadas', descripcion: 'Paseos, grupos y socialización', imagen: 'uploads/quedadas.jpeg' },
    { tipo: 'miscelanea', nombre: ' Miscelánea', descripcion: 'Otros eventos y actividades variadas', imagen: 'uploads/miscelanea.png' }
  ];

  /** Tarjetas informativas para mostrar en la interfaz */
  tarjetasInformativas = [
    {
      titulo: '¿Cómo participar?',
      imagen: 'uploads/quedadas.jpeg',
      descripcion: 'Descubre cómo formar parte de los eventos caninos.',
      link: '/eventos',
      boton: 'Ver más'
    },
    {
      titulo: 'Únete a la comunidad',
      imagen: 'uploads/comunidad.png',
      descripcion: 'Regístrate y accede a todos los beneficios.',
      link: '/registro',
      boton: 'Registrarse'
    },
    {
      titulo: 'Eventos solidarios',
      imagen: 'uploads/solidarios.png',
      descripcion: 'Apoya causas benéficas y de ayuda animal.',
      link: '/eventos',
      boton: 'Ver solidarios'
    }
  ];

  /**
   * Constructor para inicializar los servicios necesarios.
   * 
   * @param route - Activador de rutas para obtener el ID del evento
   * @param eventService - Servicio para manejar la información de los eventos
   * @param router - Enrutador para navegar entre las vistas
   */
  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  /**
   * Método que se ejecuta al inicializar el componente.
   * Obtiene el ID del evento desde los parámetros de la URL y carga la información del evento y los asistentes.
   */
  ngOnInit(): void {
    this.isLoggedIn = !!localStorage.getItem('auth_token');
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.eventService.getEventoPorId(+id).subscribe({
        next: (data) => this.evento = data,
        error: (err) => console.error('Error al cargar evento:', err)
      });

      this.eventService.getAsistentesEvento(+id).subscribe({
        next: (res) => {
          this.asistentesResumen = res.resumen;
          this.asistentesNombres = res.nombres;
        },
        error: (err) => console.error('Error al obtener asistentes:', err)
      });
    }
  }

  /**
   * Obtiene la URL completa de la imagen del evento.
   * 
   * @param imagenUrl - URL de la imagen
   * @returns URL completa de la imagen, si no tiene, devuelve la ruta por defecto
   */
  getImagenUrl(imagenUrl: string): string {
    if (!imagenUrl) return 'assets/images/eventos/default.jpg';

    if (imagenUrl.startsWith('http')) {
      return imagenUrl;
    }

    if (imagenUrl.includes('uploads/')) {
      return environment.imagenUrlBase + imagenUrl.replace(/^\/?uploads\//, '');
    }

    return 'assets/images/eventos/' + imagenUrl;
  }

  /**
   * Permite al usuario apuntarse al evento.
   * Si el usuario no está autenticado, lo redirige a la página de inicio de sesión.
   * 
   * @returns Void
   */
  apuntarse(): void {
    if (!this.evento) return;

    if (!this.isLoggedIn) {
      this.irALogin();
      return;
    }

    this.eventService.apuntarseAEvento(this.evento).subscribe({
      next: (res) => {
        this.evento!.yaInscrito = true;
        this.evento!.apuntados = (this.evento!.apuntados || 0) + 1;
        alert(res.mensaje);
      },
      error: (err) => {
        console.error('❌ Error al apuntarse:', err);
        alert('⚠️ Ocurrió un error al apuntarte. Revisa tu conexión o inicia sesión de nuevo.');
      }
    });
  }

  /**
   * Redirige al usuario a la página de inicio de sesión.
   */
  irALogin(): void {
    alert('🔒 Necesitas iniciar sesión para apuntarte a un evento.');
    this.router.navigate(['/login']);
  }
}

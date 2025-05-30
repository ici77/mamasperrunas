import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { EventService, Evento } from '../../services/event.service';

@Component({
  selector: 'app-detalle-evento',
  templateUrl: './detalle-evento.component.html',
  styleUrls: ['./detalle-evento.component.css'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class DetalleEventoComponent implements OnInit {
  evento: Evento | null = null;
  isLoggedIn: boolean = false;
  asistentesResumen: string = '';
  asistentesNombres: string[] = [];

  categorias = [
    { tipo: 'celebraciones', nombre: ' Celebraciones', descripcion: 'Fiestas y aniversarios perrunos', imagen: 'uploads/celebraciones.png' },
    { tipo: 'concursos', nombre: ' Concursos', descripcion: 'Competiciones y talentos caninos', imagen: 'uploads/concurso.png' },
    { tipo: 'solidarios', nombre: ' Solidarios', descripcion: 'Eventos benéficos y de ayuda', imagen: 'uploads/solidarios.png' },
    { tipo: 'talleres', nombre: ' Talleres', descripcion: 'Aprende y diviértete con tu mascota', imagen: 'uploads/talleres.png' },
    { tipo: 'quedadas', nombre: ' Quedadas', descripcion: 'Paseos, grupos y socialización', imagen: 'uploads/quedadas.jpeg' },
    { tipo: 'miscelanea', nombre: ' Miscelánea', descripcion: 'Otros eventos y actividades variadas', imagen: 'uploads/miscelanea.png' }
  ];

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

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

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

  getImagenUrl(imagenUrl: string): string {
    if (!imagenUrl) return 'assets/images/eventos/default.jpg';
    const ruta = imagenUrl.startsWith('/') ? imagenUrl : '/' + imagenUrl;
    return imagenUrl.startsWith('http') ? imagenUrl : 'http://localhost:8080' + ruta;
  }

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

  irALogin(): void {
    alert('🔒 Necesitas iniciar sesión para apuntarte a un evento.');
    this.router.navigate(['/login']);
  }
}

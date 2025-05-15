import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { EventService, Evento } from '../../services/event.service';

@Component({
  standalone: true,
  selector: 'app-eventos',
  templateUrl: './eventos.component.html',
  styleUrls: ['./eventos.component.css'],
  imports: [CommonModule, FormsModule, RouterModule]
})
export class EventosComponent implements OnInit {
  eventos: Evento[] = [];
  eventosDestacados: Evento[] = [];

  tipoSeleccionado: string = '';
  esDePagoSeleccionado: string = 'todos';
  soloDestacados: boolean = false;
  isLoggedIn: boolean = false;
  userId: number | null = null;

  categorias = [
    { tipo: 'celebraciones', nombre: '🎉 Celebraciones', descripcion: 'Fiestas y aniversarios perrunos', imagen: 'assets/images/eventos/celebraciones.png' },
    { tipo: 'concursos', nombre: '🏆 Concursos', descripcion: 'Competiciones y talentos caninos', imagen: 'assets/images/eventos/concurso.png' },
    { tipo: 'solidarios', nombre: '❤️ Solidarios', descripcion: 'Eventos benéficos y de ayuda', imagen: 'assets/images/eventos/solidarios.png' },
    { tipo: 'talleres', nombre: '🧠 Talleres', descripcion: 'Aprende y diviértete con tu mascota', imagen: 'assets/images/eventos/talleres.png' },
    { tipo: 'quedadas', nombre: '🌳 Quedadas', descripcion: 'Paseos, grupos y socialización', imagen: 'assets/images/eventos/quedadas.jpeg' },
    { tipo: 'miscelanea', nombre: '🧩 Miscelánea', descripcion: 'Otros eventos y actividades variadas', imagen: 'assets/images/eventos/miscelanea.png' }
  ];

  get nombreCategoriaSeleccionada(): string {
    const categoria = this.categorias.find(c => c.tipo === this.tipoSeleccionado);
    return categoria ? categoria.nombre : '';
  }

  constructor(
    private eventService: EventService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

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

  cargarEventosDestacados(): void {
    this.eventService.getDestacados().subscribe(eventos => {
      this.eventService.getConteoApuntados().subscribe(conteo => {
        this.eventosDestacados = eventos.map(evento => ({
          ...evento,
          apuntados: conteo[evento.id] || 0,
          yaInscrito: false
        }));

        if (this.isLoggedIn) {
          this.verificarInscripciones(this.eventosDestacados);
        }
      });
    });
  }

  filtrarEventos(): void {
    const tipo = this.tipoSeleccionado || '';
    const pago = this.esDePagoSeleccionado || 'todos';
    const destacado = this.soloDestacados;

    this.eventService.buscarEventos(tipo, pago, destacado).subscribe(eventos => {
      this.eventos = eventos.map(e => ({ ...e, yaInscrito: false }));
      if (this.isLoggedIn) {
        this.verificarInscripciones(this.eventos);
      }
    });
  }

  apuntarse(evento: Evento): void {
  if (!this.isLoggedIn) {
    this.irALogin();
    return;
  }

  this.eventService.apuntarseAEvento(evento).subscribe({
    next: (res) => {
  evento.yaInscrito = true;
  evento.apuntados = (evento.apuntados || 0) + 1;
  alert(res.mensaje); // ← lee el mensaje del backend
},
    error: (err) => {
      console.error('❌ Error al apuntarse:', err);
      alert('⚠️ Ocurrió un error al apuntarte. Revisa tu conexión o inicia sesión de nuevo.');
    }
  });
}



  verificarInscripciones(lista: Evento[]): void {
    lista.forEach(evento => {
      this.eventService.estaInscrito(evento.id).subscribe(res => {
        evento.yaInscrito = res === true;
      });
    });
  }

  irACrearEvento(): void {
    this.router.navigate(['/crear-evento']);
  }

  irALogin(): void {
    this.router.navigate(['/login']);
  }

  filtrarPorCategoria(tipo: string): void {
    this.tipoSeleccionado = tipo;
    this.filtrarEventos();
  }

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

  tarjetasInformativas = [
    {
      titulo: '¿Cómo participar?',
      imagen: 'assets/images/eventos/quedadas.jpeg',
      descripcion: 'Descubre cómo formar parte de los eventos caninos.',
      link: '/eventos',
      boton: 'Ver más'
    },
    {
  titulo: 'Únete a la comunidad',
  imagen: 'assets/images/eventos/comunidad.png', 
  descripcion: 'Regístrate y accede a todos los beneficios.',
  link: '/registro',
  boton: 'Registrarse'
}
,
    {
      titulo: 'Eventos solidarios',
      imagen: 'assets/images/eventos/solidarios.png',
      descripcion: 'Apoya causas benéficas y de ayuda animal.',
      link: '/eventos',
      boton: 'Ver solidarios'
    }
  ];
}

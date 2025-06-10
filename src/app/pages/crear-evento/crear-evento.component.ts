import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService, Evento } from '../../services/event.service';
import { RouterModule } from '@angular/router'; 
import { environment } from '../../../environments/environment';

/**
 * Componente para crear un nuevo evento.
 * Permite al usuario rellenar un formulario con los detalles del evento, 
 * incluyendo título, descripción, fecha, tipo de evento, y una imagen.
 * 
 * @component
 * @example
 * <app-crear-evento></app-crear-evento>
 */
@Component({
  selector: 'app-crear-evento',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
  /** Objeto para almacenar los datos del nuevo evento */
  nuevoEvento: Partial<Evento> = {
    titulo: '',
    descripcion: '',
    fecha: '',
    lugar: '',
    esDePago: false,
    imagenUrl: '',
    tipoEvento: '',
    destacado: false
  };

  /** Categorías disponibles para los eventos */
  categorias = [
    { tipo: 'celebraciones', nombre: ' Celebraciones', descripcion: 'Fiestas y aniversarios perrunos', imagen: 'uploads/celebraciones.png' },
    { tipo: 'concursos', nombre: ' Concursos', descripcion: 'Competiciones y talentos caninos', imagen: 'uploads/concurso.png' },
    { tipo: 'solidarios', nombre: ' Solidarios', descripcion: 'Eventos benéficos y de ayuda', imagen: 'uploads/solidarios.png' },
    { tipo: 'talleres', nombre: ' Talleres', descripcion: 'Aprende y diviértete con tu mascota', imagen: 'uploads/talleres.png' },
    { tipo: 'quedadas', nombre: 'Quedadas', descripcion: 'Paseos, grupos y socialización', imagen: 'uploads/quedadas.jpeg' },
    { tipo: 'miscelanea', nombre: ' Miscelánea', descripcion: 'Otros eventos y actividades variadas', imagen: 'uploads/miscelanea.png' }
  ];

  /** Tarjetas informativas para la interfaz */
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
   * Constructor para inicializar el servicio de eventos y el enrutador.
   * 
   * @param eventService - Servicio para manejar las operaciones de eventos
   * @param router - Enrutador para redirigir al usuario
   */
  constructor(private eventService: EventService, private router: Router) {}

  /**
   * Método que se ejecuta al crear un nuevo evento. Valida los campos necesarios y envía los datos al backend.
   * 
   * Si los campos obligatorios no están completos, muestra una alerta. 
   * Si se seleccionó una imagen, la agrega a la solicitud.
   */
  crearEvento(): void {
    if (!this.nuevoEvento.titulo || !this.nuevoEvento.fecha || !this.nuevoEvento.tipoEvento) {
      alert('⚠️ Título, fecha y tipo de evento son obligatorios');
      return;
    }

    const formData = new FormData();
    formData.append('evento', new Blob([JSON.stringify(this.nuevoEvento)], { type: 'application/json' }));

    if (this.imagenSeleccionada) {
      formData.append('imagen', this.imagenSeleccionada);
    }

    this.eventService.crearEventoConImagen(formData).subscribe({
      next: () => {
        alert('✅ Evento creado correctamente');
        this.router.navigate(['/eventos']);
      },
      error: err => {
        console.error('❌ Error al crear evento', err);
        alert('⚠️ Error al crear el evento');
      }
    });
  }

  /** URL de previsualización de la imagen seleccionada */
  imagenPreviewUrl: string | null = null;

  /** Imagen seleccionada por el usuario */
  imagenSeleccionada?: File;

  /**
   * Método que maneja la selección de una imagen para el evento.
   * Redimensiona la imagen antes de enviarla al backend.
   * 
   * @param event - Evento de cambio al seleccionar un archivo
   */
  onFileSelected(event: any): void {
    const file: File = event.target.files[0];

    if (file) {
      this.resizeImage(file, 800, 600).then(blob => {
        const nombreArchivo = file.name.replace(/\.[^/.]+$/, "");
        const fileFinal = new File([blob], `${nombreArchivo}_resized.jpg`, { type: 'image/jpeg' });
        this.imagenSeleccionada = fileFinal;

        // 🖼 Crear la URL de previsualización
        const reader = new FileReader();
        reader.onload = (e: any) => {
          this.imagenPreviewUrl = e.target.result;
        };
        reader.readAsDataURL(fileFinal);
      }).catch(err => {
        console.error('❌ Error al redimensionar imagen:', err);
        alert('No se pudo procesar la imagen');
      });
    }
  }

  /**
   * Obtiene la URL completa de la imagen.
   * 
   * @param ruta - Ruta de la imagen
   * @returns URL completa de la imagen
   */
  getImagenUrl(ruta: string): string {
    if (!ruta) return '';
    if (ruta.startsWith('http')) return ruta;
    return environment.imagenUrlBase + ruta.replace(/^\/?uploads\//, '');
  }

  /**
   * Redimensiona una imagen manteniendo su proporción.
   * 
   * @param file - Archivo de imagen a redimensionar
   * @param maxWidth - Ancho máximo permitido para la imagen
   * @param maxHeight - Alto máximo permitido para la imagen
   * @returns Una promesa que resuelve en un Blob de la imagen redimensionada
   */
  resizeImage(file: File, maxWidth: number, maxHeight: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (event: any) => {
        const img = new Image();
        img.src = event.target.result;

        img.onload = () => {
          const canvas = document.createElement('canvas');

          let width = img.width;
          let height = img.height;

          // Redimensionar proporcionalmente
          if (width > maxWidth || height > maxHeight) {
            if (width > height) {
              height = Math.round((height *= maxWidth / width));
              width = maxWidth;
            } else {
              width = Math.round((width *= maxHeight / height));
              height = maxHeight;
            }
          }

          canvas.width = width;
          canvas.height = height;

          const ctx = canvas.getContext('2d');
          ctx?.drawImage(img, 0, 0, width, height);

          canvas.toBlob(blob => {
            if (blob) resolve(blob);
            else reject(new Error("No se pudo convertir la imagen"));
          }, 'image/jpeg', 0.8); // Puedes ajustar el tipo y calidad aquí
        };
      };

      reader.onerror = err => reject(err);
      reader.readAsDataURL(file);
    });
  }
}

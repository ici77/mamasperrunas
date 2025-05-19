import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { EventService, Evento } from '../../services/event.service';
import { RouterModule } from '@angular/router'; 

@Component({
  selector: 'app-crear-evento',
  standalone: true,
   imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './crear-evento.component.html',
  styleUrls: ['./crear-evento.component.css']
})
export class CrearEventoComponent {
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

  constructor(private eventService: EventService, private router: Router) {}
 categorias = [
  { tipo: 'celebraciones', nombre: ' Celebraciones', descripcion: 'Fiestas y aniversarios perrunos', imagen: 'uploads/celebraciones.png' },
  { tipo: 'concursos', nombre: ' Concursos', descripcion: 'Competiciones y talentos caninos', imagen: 'uploads/concurso.png' },
  { tipo: 'solidarios', nombre: ' Solidarios', descripcion: 'Eventos benéficos y de ayuda', imagen: 'uploads/solidarios.png' },
  { tipo: 'talleres', nombre: ' Talleres', descripcion: 'Aprende y diviértete con tu mascota', imagen: 'uploads/talleres.png' },
  { tipo: 'quedadas', nombre: 'Quedadas', descripcion: 'Paseos, grupos y socialización', imagen: 'uploads/quedadas.jpeg' },
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
  imagenPreviewUrl: string | null = null;

  imagenSeleccionada?: File;
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
getImagenUrl(ruta: string): string {
  if (!ruta) return '';
  return ruta.startsWith('http') ? ruta : `http://localhost:8080/${ruta}`;
}



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

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * 📌 `ForumGridComponent`
 *
 * Este componente muestra una cuadrícula con las diferentes categorías del foro.
 * Cada categoría tiene un nombre, una breve descripción y un contador de mensajes.
 *
 * ℹ️ **Uso:** Se muestra en la sección de foro para permitir a los usuarios navegar por las categorías.
 */
@Component({
  selector: 'app-forum-grid',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forum-grid.component.html',
  styleUrls: ['./forum-grid.component.css']
})
export class ForumGridComponent {
  /**
   * 📌 Lista de categorías del foro.
   *
   * Cada categoría contiene:
   * - `name` (**string**): Nombre de la categoría.
   * - `description` (**string**): Breve descripción sobre el tema de discusión.
   * - `messageCount` (**number**): Cantidad de mensajes en la categoría.
   */
  categories = [
    { name: 'Salud Canina', description: 'Consejos sobre salud y cuidado veterinario.', messageCount: 10 },
    { name: 'Alimentación', description: 'Discute sobre dietas y nutrición canina.', messageCount: 5 },
    { name: 'Entrenamiento', description: 'Técnicas y consejos para entrenar a tu perro.', messageCount: 8 },
    { name: 'Adopciones', description: 'Publica y busca adopciones de perros.', messageCount: 12 },
    { name: 'Eventos', description: 'Organiza y participa en eventos.', messageCount: 3 },
    { name: 'Razas', description: 'Información y curiosidades sobre razas.', messageCount: 7 },
    { name: 'Cuidados Especiales', description: 'Atención a perros con necesidades especiales.', messageCount: 4 },
    { name: 'Productos', description: 'Recomendaciones de productos para perros.', messageCount: 6 },
    { name: 'Historias', description: 'Comparte historias y experiencias.', messageCount: 9 }
  ];
}

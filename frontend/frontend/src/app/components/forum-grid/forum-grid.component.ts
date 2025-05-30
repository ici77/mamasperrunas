
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Component, ViewEncapsulation } from '@angular/core';




/**
 * 📌 `ForumGridComponent`
 *
 * Este componente muestra una cuadrícula con las diferentes categorías del foro y también se integra con el navbar.
 * Cada categoría tiene un nombre, una breve descripción y un contador de mensajes.
 *
 * ℹ️ **Uso:** Se muestra en la sección de foro para permitir a los usuarios navegar por las categorías.
 */
@Component({
  selector: 'app-forum-grid',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './forum-grid.component.html',
  styleUrls: ['./forum-grid.component.css'], // Asegurar que este archivo está correctamente vinculado
  encapsulation: ViewEncapsulation.None // 🔹 Esto permitirá que los estilos se apliquen globalmente
})

export class ForumGridComponent {

  /**
   * 📌 Lista de categorías del foro.
   */
  categories = [
    { name: 'Salud Canina', description: 'Consejos sobre salud y cuidado veterinario.', messageCount: 10, route: 'salud-canina' },
    { name: 'Alimentación', description: 'Discute sobre dietas y nutrición canina.', messageCount: 5, route: 'alimentacion' },
    { name: 'Entrenamiento', description: 'Técnicas y consejos para entrenar a tu perro.', messageCount: 8, route: 'entrenamiento' },
    { name: 'Adopciones', description: 'Publica y busca adopciones de perros.', messageCount: 12, route: 'adopciones' },
    { name: 'Eventos', description: 'Organiza y participa en eventos.', messageCount: 3, route: 'eventos' },
    { name: 'Razas', description: 'Información y curiosidades sobre razas.', messageCount: 7, route: 'razas' },
    { name: 'Cuidados Especiales', description: 'Atención a perros con necesidades especiales.', messageCount: 4, route: 'cuidados-especiales' },
    { name: 'Productos', description: 'Recomendaciones de productos para perros.', messageCount: 6, route: 'productos' },
    { name: 'Historias', description: 'Comparte historias y experiencias.', messageCount: 9, route: 'historias' },
    { name: 'Viajes', description: 'Ideas para viajes con nuestros peludos', messageCount: 4, route: 'viajes' },
    { name: 'Lugares', description: 'Nuestros lugares favoritos', messageCount: 6, route: 'lugares' },
    { name: 'Fotos', description: 'Presentando a nuestros perrhijos', messageCount: 9, route: 'fotos' }
  ];
}

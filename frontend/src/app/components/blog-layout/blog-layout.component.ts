import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router'; // 💡 Importar RouterModule

/**
 * @component BlogLayoutComponent
 * @description Componente de estructura para el blog. Define la plantilla y los estilos
 * utilizados en la sección del blog de la aplicación.
 * 
 * - Se define como un **standalone component**.
 * - Importa **CommonModule** para funcionalidades básicas de Angular.
 * - Importa **RouterModule** para manejar la navegación dentro del blog.
 * 
 * @selector app-blog-layout
 * @standalone true
 * @imports CommonModule, RouterModule
 */
@Component({
  selector: 'app-blog-layout',
  standalone: true, // 💡 Marcarlo como standalone
  imports: [CommonModule, RouterModule], // 💡 Importar RouterModule aquí
  templateUrl: './blog-layout.component.html',
  styleUrls: ['./blog-layout.component.css']
})
export class BlogLayoutComponent {
  /**
   * Constructor del componente BlogLayoutComponent.
   * En este caso, el componente no requiere dependencias en el constructor.
   */
  constructor() {}
}

import { Component, OnInit } from '@angular/core';
import { RouterModule, Router } from '@angular/router'; // Importamos Router
import { CommonModule } from '@angular/common';

/**
 * @component BlogComponent
 * @description Componente principal del Blog.
 * 
 * - Muestra las categorías de artículos.
 * - Gestiona la navegación dentro del blog.
 * - Permite verificar si el usuario está en la página raíz del blog.
 * 
 * @selector app-blog
 * @standalone true
 * @imports RouterModule, CommonModule
 */
@Component({
  selector: 'app-blog',
  standalone: true,
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css'],
  imports: [RouterModule, CommonModule] // ✅ Agregamos CommonModule para evitar errores de directivas comunes
})
export class BlogComponent implements OnInit {
  
  /**
   * @constructor
   * @description Inicializa el componente BlogComponent.
   * @param {Router} router - Servicio para gestionar la navegación y obtener la URL actual.
   */
  constructor(private router: Router) {}

  /**
   * @method isBlogRoot
   * @description Verifica si la URL actual es exactamente `/blog`.
   * @returns {boolean} - Retorna `true` si estamos en la raíz del blog, de lo contrario `false`.
   */
  isBlogRoot(): boolean {
    return this.router.url === '/blog';
  }

  /**
   * @method ngOnInit
   * @description Método de ciclo de vida que se ejecuta al inicializar el componente.
   */
  ngOnInit(): void {
    // Lógica adicional si se requiere en el futuro
  }
}

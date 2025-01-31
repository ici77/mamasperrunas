import { Component, AfterViewInit, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  standalone: true,
  selector: 'app-navbar',
  imports: [RouterLink],
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements AfterViewInit {
  constructor(private elementRef: ElementRef) {}

  ngAfterViewInit() {
    // Función para cerrar un menú dado su ID
    const cerrarMenu = (menuId: string) => {
      const menu = document.getElementById(menuId);
      if (menu) {
        menu.classList.remove('show');
      }
    };

    // Obtener todos los elementos con la clase 'nav-link dropdown-toggle' dentro del componente
    const dropdownToggles = this.elementRef.nativeElement.querySelectorAll('.nav-link.dropdown-toggle');

    // Recorrer los elementos y añadir event listeners
    dropdownToggles.forEach((toggle: HTMLElement) => {
      toggle.addEventListener('click', function () {
        // Obtener el ID del menú correspondiente
        const menuId = this.id.replace('Dropdown', 'Menu');

        
        // Configurar el temporizador para cerrar el menú después de 3 segundos
        setTimeout(() => cerrarMenu(menuId), 1500);
      });
    });

    // Cerrar los menús al hacer clic fuera de ellos
    document.addEventListener('click', (event: MouseEvent) => {
      dropdownToggles.forEach((toggle: HTMLElement) => {
        const menuId = toggle.id.replace('Dropdown', 'Menu');
        const menu = document.getElementById(menuId);
        // Verificar si el clic fue fuera del menú y del botón que lo abre
        if (menu && !menu.contains(event.target as Node) && !toggle.contains(event.target as Node)) {
          cerrarMenu(menuId);
        }
      });
    });
  }
}
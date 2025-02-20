import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

/**
 * @component ExpertsComponent
 * @description Componente que muestra artículos de expertos en el blog.
 * 
 * - Se define como un **standalone component**.
 * - Permite la navegación utilizando `routerLink` gracias a la importación de `RouterModule`.
 * 
 * @selector app-experts
 * @standalone true
 * @imports RouterModule
 */
@Component({
  selector: 'app-experts',
  standalone: true,
  templateUrl: './experts.component.html',
  styleUrls: ['./experts.component.css'],
  imports: [RouterModule] // ✅ Importamos RouterModule para permitir el uso de routerLink
})
export class ExpertsComponent {
  /**
   * @constructor
   * @description Inicializa el componente ExpertsComponent.
   * Actualmente no tiene lógica interna, pero podría ser ampliado en el futuro.
   */
  constructor() {}
}

import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-banner',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="banner" [style.backgroundImage]="'url(' + backgroundImage + ')'">
      <h1>{{ title }}</h1>
    </div>
  `,
  styleUrls: ['./banner.component.css']
})
export class BannerComponent {
  @Input() backgroundImage: string = ''; // Imagen de fondo
  @Input() title: string = ''; // Título del banner
}

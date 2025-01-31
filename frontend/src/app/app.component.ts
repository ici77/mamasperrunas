import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { ForumGridComponent } from './pages/foro/forum-grid/forum-grid.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, FooterComponent],
  template: `
    <app-navbar></app-navbar> <!-- Navbar siempre visible -->
    <router-outlet></router-outlet> <!-- Renderiza la ruta activa -->
    <app-footer></app-footer> <!-- Footer siempre visible -->
  `,
  styleUrls: ['./app.component.css'],
})
export class AppComponent {}

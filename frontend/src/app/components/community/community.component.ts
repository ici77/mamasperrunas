import { Component } from '@angular/core';
import { CommonModule } from '@angular/common'; // Importamos CommonModule

@Component({
  selector: 'app-community',
  standalone: true, // Standalone habilitado
  imports: [CommonModule], // Importamos CommonModule para usar *ngFor
  templateUrl: './community.component.html',
  styleUrls: ['./community.component.css']
})
export class CommunityComponent {
  communityPosts = [
    {
      title: 'Consejos para ser social',
      excerpt: 'Descubre cómo hacer que tu perro se sienta cómodo con otros.',
      author: 'Ana López',
      authorImage: 'assets/images/landing/user3.png'
    },
    {
      title: 'Tu casa más pet-friendly',
      excerpt: 'Te damos algunas ideas para adaptar tu hogar y hacerlo más seguro y divertido.',
      author: 'Carlos Méndez',
      authorImage: 'assets/images/landing/user3.png'
    },
    {
      title: 'Rutas de senderismo con perros',
      excerpt: 'Explora las mejores rutas donde puedes llevar a tu perro.',
      author: 'Laura Sánchez',
      authorImage: 'assets/images/landing/user3.png'
    }
  ];
}

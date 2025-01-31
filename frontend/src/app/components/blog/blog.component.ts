import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-blog',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  blogPosts = [
    { title: '5 Consejos para un paseo perfecto', link: '#' },
    { title: 'Alimentación saludable para perros', link: '#' },
    { title: 'Cómo elegir la mejor veterinaria', link: '#' }
  ];
}

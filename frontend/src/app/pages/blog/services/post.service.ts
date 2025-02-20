import { Injectable } from '@angular/core';

/**
 * Servicio para manejar los posts del blog.
 * Proporciona los posts destacados que se mostrarán en el carrusel.
 */
@Injectable({
  providedIn: 'root'
})
export class PostService {
  /**
   * Array con los posts destacados del blog.
   */
  private postsDestacados = [
    {
      id: 1,
      title: 'Consejos de un veterinario para cuidar a tu perro',
      image: 'assets/img/experts.jpg',
      category: 'Hablan nuestros expertos',
      route: '/blog/experts'
    },
    {
      id: 2,
      title: 'Últimas noticias sobre salud canina',
      image: 'assets/img/news.jpg',
      category: 'Noticias',
      route: '/blog/news'
    },
    {
      id: 3,
      title: 'Descubre las razas más cariñosas',
      image: 'assets/img/breeds.jpg',
      category: 'Razas',
      route: '/blog/breeds'
    },
    {
      id: 4,
      title: 'Cómo entrenar a tu perro en casa',
      image: 'assets/img/tips.jpg',
      category: 'Consejos y opiniones',
      route: '/blog/tips'
    },
    {
      id: 5,
      title: 'Actividades al aire libre para perros y dueños',
      image: 'assets/img/life.jpg',
      category: 'Vida canina',
      route: '/blog/life'
    }
  ];

  /**
   * Constructor del servicio PostService.
   */
  constructor() {}

  /**
   * Devuelve la lista de posts destacados.
   * @returns {Array} Lista de posts destacados.
   */
  getPostsDestacados() {
    return this.postsDestacados;
  }
}

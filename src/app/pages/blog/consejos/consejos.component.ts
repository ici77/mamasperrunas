import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-consejos',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './consejos.component.html',
  styleUrls: ['./consejos.component.css']
})
export class ConsejosComponent {
  consejos = [
    {
      titulo: 'Cómo preparar a tu perro para el verano',
      resumen: 'Consejos prácticos para evitar golpes de calor y cuidar su hidratación.',
      imagen: 'assets/images/consejos/verano.png',
      enlace: '#'
    },
    {
      titulo: '¿Qué meter en la maleta de tu perrhijo?',
      resumen: 'Consejos para que no se te olvide nada. Los imprescindibles.',
      imagen: 'assets/images/consejos/viaje.png',
      enlace: '#'
    },
    {
      titulo: '5 snacks naturales para perros',
      resumen: 'Ideas de premios saludables que puedes preparar en casa.',
      imagen: 'assets/images/consejos/snack.png',
      enlace: '#'
    },

    {
      titulo: 'Opinión: ¿Los perros deben dormir en la cama?',
      resumen: 'Una reflexión sobre los beneficios y límites del colecho con mascotas.',
      imagen: 'assets/images/consejos/cama.png',
      enlace: '#'
    },

  ];
}

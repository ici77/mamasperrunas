import { Component, OnInit } from '@angular/core';
import jwt_decode from 'jwt-decode'; 
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  nombreUsuario: string | undefined;
  fotoPerfil: string | undefined;

  constructor(private router: Router) {}

  ngOnInit(): void {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken: any = jwt_decode(token);
        this.nombreUsuario = decodedToken.nombre;  // Mapeado al campo 'nombre'
        this.fotoPerfil = decodedToken.foto_perfil;  // Mapeado al campo 'foto_perfil'
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.router.navigate(['/login']);
      }
    } else {
      this.router.navigate(['/login']);
    }
  }
}

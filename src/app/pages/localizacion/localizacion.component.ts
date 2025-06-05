import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

declare const google: any;

@Component({
  selector: 'app-localizacion',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './localizacion.component.html',
  styleUrls: ['./localizacion.component.scss']
})
export class LocalizacionComponent implements OnInit {

  ngOnInit(): void {
    this.initMap();
  }

  initMap(): void {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };

          const map = new google.maps.Map(document.getElementById('map'), {
            center: userLocation,
            zoom: 14
          });

          new google.maps.Marker({
            position: userLocation,
            map: map,
            title: "¡Estás aquí!"
          });
        },
        () => {
          this.showDefaultMap();
        }
      );
    } else {
      this.showDefaultMap();
    }
  }

  showDefaultMap(): void {
    const sevilla = { lat: 37.3891, lng: -5.9845 };
    const map = new google.maps.Map(document.getElementById('map'), {
      center: sevilla,
      zoom: 12
    });
  }
}

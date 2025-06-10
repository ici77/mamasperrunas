import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-news',
  standalone: true,
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css'],
  imports: [RouterModule, CommonModule] // Se añaden las importaciones necesarias
})
export class NewsComponent {
}

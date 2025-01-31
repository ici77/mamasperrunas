import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BannerportadaComponent } from '../../components/bannerportada/bannerportada.component';
import { GridComponent } from '../../components/grid/grid.component';
import { CircleGridComponent } from '../../components/circle-grid/circle-grid.component';
import { BlogComponent } from '../../components/blog/blog.component';
import { CommunityComponent } from '../../components/community/community.component';

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [
    CommonModule,
    BannerportadaComponent,
    GridComponent,
    CircleGridComponent,
    BlogComponent,
    CommunityComponent,
  ],
  template: `
    <app-bannerportada></app-bannerportada>
    <div style="text-align: center; margin-top: 50px;">
      <app-grid></app-grid>
      <app-circle-grid></app-circle-grid>
      <app-blog></app-blog>
      <app-community></app-community>
    </div>
  `,
  styleUrls: ['./landing-page.component.css'],
})
export class LandingPageComponent {}

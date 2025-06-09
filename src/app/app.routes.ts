import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AuthGuard } from './guards/auth.guard';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { ForumGridComponent } from './components/forum-grid/forum-grid.component';
import { CrearPostComponent } from './pages/crear-post/crear-post.component';
import { CategoryForoComponent } from './components/category-foro/category-foro.component';
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';
import { DogListComponent } from './pages/dog-list/dog-list.component';
import { BlogComponent } from './pages/blog/blog.component';
import { ExpertsComponent } from './pages/blog/experts/experts.component';
import { NewsComponent } from './pages/blog/news/news.component';

import { LifeComponent } from './pages/blog/life/life.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component';
import { EventosComponent } from './pages/eventos/eventos.component';
import { PerfilComponent } from './pages/perfil/perfil.component';
import { LocalizacionComponent } from './pages/localizacion/localizacion.component';
export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/:category', component: CategoryPageComponent },

  // 📌 Foro
  { path: 'foro', component: ForumGridComponent },
  { path: 'foro/:category', component: CategoryForoComponent },
  { path: 'post/:id', component: PostDetailComponent },

  // 📌 Autenticación y usuario
  { path: 'registro', component: RegistroComponent },
  { path: 'login', component: LoginComponent },
   { path: 'perfil', component: PerfilComponent },
  // 📌 Razas y posts
  { path: 'razas', component: DogListComponent },
  { path: 'crear-post', component: CrearPostComponent },

  // 📌 Crear evento
  {
    path: 'crear-evento',
    loadComponent: () =>
      import('./pages/crear-evento/crear-evento.component').then(m => m.CrearEventoComponent)
  },

  {
  path: 'calendario',
  loadComponent: () =>
    import('./pages/calendario-eventos/calendario-eventos.component')
      .then(m => m.CalendarioEventosComponent)
},

{
  path: 'consejos',
  loadComponent: () => import('./pages/blog/consejos/consejos.component').then(m => m.ConsejosComponent)
},




  // 📌 Ver detalle de evento
  {
    path: 'evento/:id',
    loadComponent: () =>
      import('./pages/detalle-evento/detalle-evento.component').then(m => m.DetalleEventoComponent)
  },

  // 📌 Página de eventos general
  { path: 'eventos', component: EventosComponent },

  // 📌 Página de localización de servicios

   { path: 'localizacion', component: LocalizacionComponent },

  // 📌 Blog y secciones
  {
  path: 'blog',
  loadComponent: () =>
    import('./components/blog-layout/blog-layout.component').then(m => m.BlogLayoutComponent),
  children: [
    { path: '', loadComponent: () => import('./pages/blog/blog.component').then(m => m.BlogComponent) },
    { path: 'experts', loadComponent: () => import('./pages/blog/experts/experts.component').then(m => m.ExpertsComponent) },
    { path: 'news', loadComponent: () => import('./pages/blog/news/news.component').then(m => m.NewsComponent) },
    
    { path: 'life', loadComponent: () => import('./pages/blog/life/life.component').then(m => m.LifeComponent) },
    { path: 'consejos', loadComponent: () => import('./pages/blog/consejos/consejos.component').then(m => m.ConsejosComponent) },
  ]
},


  // ❌ Ruta comodín
  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];

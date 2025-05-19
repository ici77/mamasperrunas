import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { AuthGuard } from './guards/auth.guard';  // Importa el guard
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
import { TipsComponent } from './pages/blog/tips/tips.component';
import { LifeComponent } from './pages/blog/life/life.component';
import { PostDetailComponent } from './components/post-detail/post-detail.component'; // ✅ Importar el nuevo componente
import { FormsModule } from '@angular/forms';
import { EventosComponent } from './pages/eventos/eventos.component';


export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent }, // Página principal
  { path: 'products', component: ProductListComponent }, // Página de tienda
  { path: 'products/:category', component: CategoryPageComponent }, // Subcategorías dentro de tienda
  { path: 'foro', component: ForumGridComponent }, // Página del foro
  { path: 'foro/:category', component: CategoryForoComponent }, // ✅ Ruta para cada categoría del foro
  
  { path: 'post/:id', component: PostDetailComponent },
  { path: 'registro', component: RegistroComponent }, // Ruta para el formulario de registro
  { path: 'login', component: LoginComponent }, // Ruta de inicio de sesión
  { path: 'profile', component: ProfileComponent }, // Ruta de perfil del usuario
  { path: 'razas', component: DogListComponent }, // Ruta para mostrar las razas
  { path: 'crear-post', component: CrearPostComponent },
  {
  path: 'crear-evento',
  loadComponent: () =>
    import('./pages/crear-evento/crear-evento.component').then(m => m.CrearEventoComponent)
},



  // 📌 Blog y sus secciones, cargando BlogLayoutComponent de forma dinámica
  {
    path: 'blog',
    loadComponent: () =>
      import('./components/blog-layout/blog-layout.component').then(m => m.BlogLayoutComponent),
    children: [
      { path: '', component: BlogComponent },
      { path: 'experts', component: ExpertsComponent },
      { path: 'news', component: NewsComponent },
      { path: 'tips', component: TipsComponent },
      { path: 'life', component: LifeComponent }
    ]
  },

  // 📌 Eventos como sección independiente
  { path: 'eventos', component: EventosComponent },
  { path: 'eventos/:id', component: EventosComponent },
  { path: 'eventos/:id/:category', component: EventosComponent },
  { path: 'eventos/:id/:category/:subcategory', component: EventosComponent },
  { path: 'eventos/:id/:category/:subcategory/:subcategory2', component: EventosComponent },

  { path: '**', redirectTo: 'login', pathMatch: 'full' }
];
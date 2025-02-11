import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { ForumGridComponent } from './pages/foro/forum-grid/forum-grid.component'; 
import { RegistroComponent } from './components/registro/registro.component'; // Importa el RegistroComponent

export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent }, // Página principal
  { path: 'products', component: ProductListComponent }, // Página de tienda 
  { path: 'products/:category', component: CategoryPageComponent }, // Subcategorías dentro de tienda
  { path: 'foro', component: ForumGridComponent }, // Página del foro
  { path: 'registro', component: RegistroComponent }, // Nueva ruta para el formulario de registro
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirección para rutas no válidas
];

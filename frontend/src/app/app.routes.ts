import { Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { CategoryPageComponent } from './components/category-page/category-page.component';
import { ForumGridComponent } from './pages/foro/forum-grid/forum-grid.component'; 
import { RegistroComponent } from './components/registro/registro.component';
import { LoginComponent } from './components/login/login.component';
import { ProfileComponent } from './components/profile/profile.component';  // Importa correctamente el componente de perfil

export const appRoutes: Routes = [
  { path: '', component: LandingPageComponent },  // Página principal
  { path: 'products', component: ProductListComponent },  // Página de tienda 
  { path: 'products/:category', component: CategoryPageComponent },  // Subcategorías dentro de tienda
  { path: 'foro', component: ForumGridComponent },  // Página del foro
  { path: 'registro', component: RegistroComponent },  // Ruta para el formulario de registro
  { path: 'login', component: LoginComponent },  // Ruta de inicio de sesión
  { path: 'profile', component: ProfileComponent },  // Ruta de perfil del usuario
  { path: '**', redirectTo: 'login', pathMatch: 'full' }  // Redirección para rutas no válidas
];

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './pages/landing-page/landing-page.component';
import { ProductListComponent } from './components/product-list/product-list.component';
import { ForumGridComponent } from './pages/foro/forum-grid/forum-grid.component'; // Corrige esta ruta
import { LoginComponent } from './components/login/login.component';



const routes: Routes = [
  { path: '', component: LandingPageComponent }, // Landing page en la ruta raíz
  { path: 'products', component: ProductListComponent }, // Página de la tienda
  { path: 'foro', component: ForumGridComponent }, // Página del foro
  { path: '**', redirectTo: '', pathMatch: 'full' }, // Redirección a la raíz si la ruta no existe
  { path: 'login', component: LoginComponent },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  
  exports: [RouterModule],
})
export class AppRoutingModule {}

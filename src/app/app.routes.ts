import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Gallery } from './gallery/gallery';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: Home }, // You'll need to create an About component later
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'gallery/:id', component: Gallery }
];

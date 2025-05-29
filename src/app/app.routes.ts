import { Routes } from '@angular/router';
import { Home } from './home/home';
import { Login } from './login/login';
import { Register } from './register/register';
import { Gallery } from './gallery/gallery';
import { Upload } from './upload/upload';

export const routes: Routes = [
  { path: '', component: Home },
  { path: 'about', component: Home }, // You'll need to create an About component later
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'upload', component: Upload }, // This will show the gallery list
  { path: 'gallery/:id', component: Gallery }
];

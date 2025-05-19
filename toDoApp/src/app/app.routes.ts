import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.page').then((m) => m.HomePage), },
  { path: '', redirectTo: 'home', pathMatch: 'full', },
  { path: 'news/:id', loadComponent: () => import('./news/news.page').then((m) => m.NewsPage), },
  { path: 'login', loadComponent: () => import('./login/login.component').then((m) => m.LoginComponent), },
  { path : 'register', loadComponent: () => import('./register/register.component').then((m) => m.RegisterComponent), },
  { path: 'saved-news', loadComponent: () => import('./saved-news/saved-news').then((m) => m.savedNews), },
  { path: 'sqlite-news/:id', loadComponent: () => import('./sqlite-news/sqlite-news').then((m) => m.SqliteNews), },
];

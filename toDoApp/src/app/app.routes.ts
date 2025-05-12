import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: 'home', loadComponent: () => import('./home/home.page').then((m) => m.HomePage), },
  { path: '', redirectTo: 'home', pathMatch: 'full', },
  { path: 'news/:id', loadComponent: () => import('./news/news.page').then((m) => m.NewsPage), },
  
];

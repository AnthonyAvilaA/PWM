import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { PrivacyComponent} from './pages/legal/privacy/privacy.component';
import { TermsComponent } from './pages/legal/terms/terms.component';
import { noAuthGuard } from './guards/auth.guard';
import { NewsComponent } from './pages/news/news.component';
import { AddNewsComponent } from './pages/add-news/add-news.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard], data: { title: 'Login' } },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard], data: { title: 'Register' } },
  { path: 'add_news', component: AddNewsComponent, data: { title: 'Add_News'}},
  { path: 'category', component: CategoriesComponent, data: { title: 'Categories' } },
  { path: 'category/:categoryName', component: CategoriesComponent, data: { title: 'Categories' } },
  { path: 'news', component: NewsComponent, data: { title: 'News' } },
  { path: 'news/:newsID', component: NewsComponent, data: { title: 'News' } },
  { path: 'privacy', component: PrivacyComponent, data: { title: 'Privacy Policy' } },
  { path: 'terms', component: TermsComponent, data: { title: 'Terms of Service' } }
];
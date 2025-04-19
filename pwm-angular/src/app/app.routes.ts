import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { LoginComponent } from './pages/login/login.component';
import { RegisterComponent } from './pages/register/register.component';
import { CategoriesComponent } from './pages/categories/categories.component';
import { PrivacyComponent} from './pages/legal/privacy/privacy.component';
import { TermsComponent } from './pages/legal/terms/terms.component';
import { noAuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent, data: { title: 'Home' } },
  { path: 'login', component: LoginComponent, canActivate: [noAuthGuard], data: { title: 'Login' } },
  { path: 'register', component: RegisterComponent, canActivate: [noAuthGuard], data: { title: 'Register' } },
  { path: 'category', component: CategoriesComponent, data: { title: 'Categories' } },
  { path: 'category/:categoryName', component: CategoriesComponent, data: { title: 'Categories' } },
  { path: 'privacy', component: PrivacyComponent, data: { title: 'Privacy Policy' } },
  { path: 'terms', component: TermsComponent, data: { title: 'Terms of Service' } }
];

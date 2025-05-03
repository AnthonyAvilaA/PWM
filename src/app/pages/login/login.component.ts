import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/core/auth.service';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule, TranslateModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  rememberMe: boolean = false;
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private translate: TranslateService
  ) {
    // Redirect if already logged in
    if (this.authService.isAuthenticated()) {
      this.router.navigate(['/']);
    }

    // Subscribe to loading and error states
    this.authService.isLoading$.subscribe(loading => {
      this.isLoading = loading;
    });

    this.authService.errorMessage$.subscribe(error => {
      this.errorMessage = error;
    });
  }

  login(): void {
    if (!this.email || !this.password) {
      this.translate.get('LOGIN.ERROR_EMPTY_FIELDS').subscribe((res: string) => {
        this.errorMessage = res;
      });
      return;
    }

    this.authService.login({
      email: this.email,
      password: this.password,
      rememberMe: this.rememberMe
    }).subscribe(success => {
      if (success) {
        this.router.navigate(['/']);
      }
    });
  }
}

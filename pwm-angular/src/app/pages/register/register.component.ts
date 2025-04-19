import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [RouterModule, FormsModule, CommonModule],
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  username: string = '';
  name: string = '';
  errorMessage: string | null = null;
  isLoading: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router
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

  register(): void {
    // Form validation
    if (!this.email || !this.password || !this.confirmPassword || !this.username) {
      this.errorMessage = 'Por favor, complete todos los campos.';
      return;
    }

    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden.';
      return;
    }

    if (this.password.length < 6) {
      this.errorMessage = 'La contraseña debe tener al menos 6 caracteres.';
      return;
    }

    // Use username as name if name is not provided
    if (!this.name) {
      this.name = this.username;
    }

    this.authService.register({
      email: this.email,
      password: this.password,
      name: this.name,
      username: this.username
    }).subscribe(success => {
      if (success) {
        this.router.navigate(['/']);
      }
    });
  }
}

import { Component } from '@angular/core';
import { AuthService } from '../services/firebase/auth.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../components/header/header.component";
import { User } from 'firebase/auth';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent],
})
export class RegisterComponent {
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onRegister() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Passwords do not match';
      return;
    }
    this.authService.register(this.email, this.password)
      .then((user: User) => {
        // Navigate to the login page or home page after successful registration
        localStorage.setItem('token', user.uid); // Store the token in localStorage
        localStorage.setItem('userName', user.email || 'User'); // Store the user name in localStorage
        this.router.navigate(['/home']);
      })
      .catch(error => {
        // Handle registration errors
        this.errorMessage = error.message;
      });
  }
}
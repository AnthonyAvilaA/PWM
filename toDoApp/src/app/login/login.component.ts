import { Component } from '@angular/core';
import { AuthService } from '../services/firebase/auth.service';
import { Router } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HeaderComponent } from "../components/header/header.component";
import { User } from 'firebase/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [IonicModule, CommonModule, FormsModule, HeaderComponent],
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  errorMessage: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService.login(this.email, this.password)
      .then((user: User) => {
        // Navigate to the home page or another page after successful login
        localStorage.setItem('token', user.uid); // Store the token in localStorage
        localStorage.setItem('userName', user.email || 'User'); // Store the user name in localStorage
        this.router.navigate(['/home']);
      })
      .catch(error => {
        // Handle login errors
        this.errorMessage = error.message;
      });
  }
}
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/firebase/auth.service';


@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  imports: [CommonModule, IonicModule, RouterLink],
})
export class HeaderComponent implements OnInit {
  isLoggedIn: boolean = false;
  userName: string = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    // Subscribe to the current user observable
    this.authService.currentUser$.subscribe(user => {
      this.isLoggedIn = !!user;
      this.userName = user?.email || ''; // Use the user's email as the display name
    });
  }

  logout() {
    this.authService.logout().then(() => {
      console.log('User logged out');
    }).catch(error => {
      console.error('Logout error:', error);
    });
  }
}
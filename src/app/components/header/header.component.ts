import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/core/auth.service';
import { AuthUser } from '@models/auth.model';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  currentUser: AuthUser | null = null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef
  ) {}

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  logout(): void {
    this.authService.logout().subscribe(success => {
      if (success) {
        this.router.navigate(['/']);
      }
    });
  }

  // Close menus when clicking outside
  @HostListener('document:click', ['$event'])
  clickOutside(event: Event) {
    // Handle burger menu close
    const burgerMenu = this.elementRef.nativeElement.querySelector('.burger-menu');
    const burgerToggle = document.getElementById('menu-toggle') as HTMLInputElement;
    
    if (burgerToggle && burgerToggle.checked && !burgerMenu.contains(event.target)) {
      burgerToggle.checked = false;
    }
    
    // Handle language menu close
    const languageMenu = this.elementRef.nativeElement.querySelector('.language-menu');
    const languageToggle = document.getElementById('language-toggle') as HTMLInputElement;
    
    if (languageToggle && languageToggle.checked && !languageMenu.contains(event.target)) {
      languageToggle.checked = false;
    }
  }
}

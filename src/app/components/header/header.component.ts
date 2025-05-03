import { Component, OnInit, HostListener, ElementRef } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthService } from '@services/core/auth.service';
import { AuthUser } from '@models/auth.model';
import { TranslateModule, TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, TranslateModule],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  isAuthenticated = false;
  currentUser: AuthUser | null = null;
  currentLang: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef,
    private translate: TranslateService
  ) {
    this.currentLang = this.translate.currentLang || this.translate.defaultLang;
  }

  ngOnInit(): void {
    // Subscribe to authentication state changes
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });
  }

  // Switch language
  switchLang(lang: string): void {
    this.translate.use(lang);
    this.currentLang = lang;
    const languageToggle = document.getElementById('language-toggle') as HTMLInputElement;
    if (languageToggle) {
      languageToggle.checked = false;
    }
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

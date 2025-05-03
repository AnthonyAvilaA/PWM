import { Injectable } from '@angular/core';
import { IThemeService } from './interfaces/theme-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements IThemeService {
  constructor() {
    // Initialize theme from localStorage or use system default
    this.applyTheme(this.getCurrentTheme());
  }

  /**
   * Gets current theme from localStorage
   * @returns The current theme ('white', 'dark', or 'default')
   */
  private getCurrentTheme(): string {
    return localStorage.getItem('theme') || 'default';
  }

  /**
   * Gets the current theme
   * @returns The current theme ('white', 'dark', or 'default')
   */
  public getTheme(): string {
    return this.getCurrentTheme();
  }

  /**
   * Sets and applies a new theme
   * @param theme The theme to set ('white', 'dark', or 'default')
   */
  public setTheme(theme: string): void {
    localStorage.setItem('theme', theme);
    this.applyTheme(theme);
  }

  /**
   * Applies the specified theme to the document body
   * @param theme The theme to apply ('white', 'dark', or 'default')
   */
  private applyTheme(theme: string): void {
    document.body.classList.remove('theme-white', 'theme-dark');
    
    switch (theme) {
      case 'white':
        // No class needed for light theme (default)
        break;
      case 'dark':
        document.body.classList.add('theme-dark');
        break;
      case 'default':
        // Check system preference for dark mode
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
          document.body.classList.add('theme-dark');
        }
        break;
    }
  }
}

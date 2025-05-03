import { Injectable } from '@angular/core';
import { IThemeService } from './interfaces/theme-service.interface';

@Injectable({
  providedIn: 'root'
})
export class ThemeService implements IThemeService {
  constructor() {
    // Initialize theme from localStorage or use light theme as default
    this.applyTheme(this.getCurrentTheme());
  }

  /**
   * Gets current theme from localStorage
   * @returns The current theme ('white', 'dark', or 'default')
   */
  private getCurrentTheme(): string {
    const savedTheme = localStorage.getItem('theme');
    // If no theme is saved or it's set to 'default', return 'white' (light theme)
    return savedTheme === 'dark' ? 'dark' : 'white';
  }

  /**
   * Gets the current theme
   * @returns The current theme ('white' or 'dark')
   */
  public getTheme(): string {
    return this.getCurrentTheme();
  }

  /**
   * Sets and applies a new theme
   * @param theme The theme to set ('white', 'dark', or 'default')
   */
  public setTheme(theme: string): void {
    // If theme is 'default' or any value other than 'dark', use 'white'
    const themeToSet = theme === 'dark' ? 'dark' : 'white';
    localStorage.setItem('theme', themeToSet);
    this.applyTheme(themeToSet);
  }

  /**
   * Applies the specified theme to the document body
   * @param theme The theme to apply ('white' or 'dark')
   */
  private applyTheme(theme: string): void {
    document.body.classList.remove('theme-white', 'theme-dark');
    
    if (theme === 'dark') {
      document.body.classList.add('theme-dark');
    }
    // No class needed for light theme (it's the default)
  }
}

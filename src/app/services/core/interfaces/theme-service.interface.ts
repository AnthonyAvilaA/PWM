export interface IThemeService {
  /**
   * Gets the current theme
   * @returns The current theme ('white', 'dark', or 'default')
   */
  getTheme(): string;

  /**
   * Sets and applies a new theme
   * @param theme The theme to set ('white', 'dark', or 'default')
   */
  setTheme(theme: string): void;
}

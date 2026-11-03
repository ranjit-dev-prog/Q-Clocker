import { Injectable, signal, effect } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private readonly THEME_KEY = 'q_clocker_theme';
  readonly isDarkMode = signal<boolean>(this.getInitialTheme());

  constructor() {
    effect(() => {
      const isDark = this.isDarkMode();
      if (isDark) {
        document.documentElement.classList.add('dark');
        localStorage.setItem(this.THEME_KEY, 'dark');
      } else {
        document.documentElement.classList.remove('dark');
        localStorage.setItem(this.THEME_KEY, 'light');
      }
    });
  }

  toggleTheme() {
    this.isDarkMode.update((v) => !v);
  }

  private getInitialTheme(): boolean {
    const saved = localStorage.getItem(this.THEME_KEY);
    if (saved) {
      return saved === 'dark';
    }
    return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  }
}


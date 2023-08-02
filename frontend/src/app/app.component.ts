import { Component } from '@angular/core';
import { ThemeService } from './services/theme.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  isDarkTheme: boolean = false;

  constructor(private themeService: ThemeService) {}

  changeTheme(isDark: boolean) {
    this.isDarkTheme = isDark;
    this.themeService.switchTheme(isDark ? 'lara-dark-blue' : 'lara-light-blue');
  }
}

import { Component, ElementRef, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { ThemeService } from '../services/theme.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html',
})
export class AppTopBarComponent {

  items!: MenuItem[];
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;

  constructor(
    public layoutService: LayoutService,
    private themeService: ThemeService,
    private sharedService: SharedService
  ) {}

  isDarkTheme: boolean = false;

  changeTheme(isDark: boolean) {
    this.isDarkTheme = isDark;
    this.themeService.switchTheme(isDark ? 'lara-dark-blue' : 'lara-light-blue');
  }

  signOut(): void {
    this.sharedService.signOut();
  }
}

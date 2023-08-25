import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { ThemeService } from '../services/theme.service';
import { SharedService } from '../services/shared.service';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit {

  items!: MenuItem[];
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;
  accountMenuItems: MenuItem[] = [];
  isDarkTheme: boolean = false;

  constructor(
    public layoutService: LayoutService,
    private themeService: ThemeService,
    private sharedService: SharedService
  ) {}

  ngOnInit(): void {
    this.getAccountMenuItems();
  }

  changeTheme(isDark: boolean) {
    this.isDarkTheme = isDark;
    this.themeService.switchTheme(isDark ? 'lara-dark-blue' : 'lara-light-blue');
  }

  signOut(): void {
    this.sharedService.signOut();
  }

  private getAccountMenuItems(): void {
    this.accountMenuItems = [
      {
        label: 'Profile',
        icon: 'pi pi-user',
        routerLink: ['/account/profile'],
      },
      {
        label: 'Settings',
        icon: 'pi pi-cog',
        routerLink: ['/account/settings'],
      },
      {
        label: 'Sign Out',
        icon: 'pi pi-power-off',
        command: () => this.signOut()
      },
    ];
  }
}

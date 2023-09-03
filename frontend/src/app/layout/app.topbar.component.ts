import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { Component, ElementRef, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { MenuItem, PrimeNGConfig } from 'primeng/api';
import { LayoutService } from './service/app.layout.service';
import { ThemeService } from '../services/theme.service';
import { SharedService } from '../services/shared.service';
import { Language } from '../types/common/language';
import { Theme } from '../types/common/theme';

@Component({
  selector: 'app-topbar',
  templateUrl: './app.topbar.component.html'
})
export class AppTopBarComponent implements OnInit, OnDestroy {

  items!: MenuItem[];
  @ViewChild('menubutton') menuButton!: ElementRef;
  @ViewChild('topbarmenubutton') topbarMenuButton!: ElementRef;
  @ViewChild('topbarmenu') menu!: ElementRef;
  accountMenuItems: MenuItem[] = [];
  isDarkTheme: boolean = false;
  languages: Language[] = [];
  selectedLanguage?: Language;
  subs: Subscription[] = [];

  constructor(
    public layoutService: LayoutService,
    private themeService: ThemeService,
    private sharedService: SharedService,
    private translateService: TranslateService,
    private config: PrimeNGConfig
  ) {}

  ngOnInit(): void {
    this.getLanguages();
    this.getAccountMenuItems();
  }

  ngOnDestroy(): void {
    this.subs.forEach((sub: Subscription) => sub.unsubscribe());
  }

  changeTheme(isDark: boolean) {
    this.isDarkTheme = isDark;
    this.themeService.switchTheme(isDark ? 'lara-dark-blue' : 'lara-light-blue');
    localStorage.setItem('theme', isDark ? Theme.DARK : Theme.LIGHT);
  }

  signOut(): void {
    this.sharedService.signOut();
  }

  languageChange(): void {
    if(this.selectedLanguage) {
      this.translateService.use(this.selectedLanguage.key);
      this.subs.push(
        this.translateService.get('primeng').subscribe(res => this.config.setTranslation(res))
      );
      this.getAccountMenuItems();
    }
  }

  private getAccountMenuItems(): void {
    this.accountMenuItems = [
      {
        label: this.translateService.instant('profile.title'),
        icon: 'pi pi-user',
        routerLink: ['/account/profile'],
      },
      {
        label: this.translateService.instant('menu.settings'),
        icon: 'pi pi-cog',
        routerLink: ['/account/settings'],
      },
      {
        label: this.translateService.instant('global.signOut'),
        icon: 'pi pi-power-off',
        command: () => this.signOut()
      },
    ];
  }

  private getLanguages(): void {
    this.languages = [
      {
        flagUrl: 'poland.png',
        name: 'Polski',
        key: 'pl'
      },
      {
        flagUrl: 'uk.png',
        name: 'English',
        key: 'en'
      }
    ];
    const browserLang = this.translateService.getBrowserLang();
    const useLang = browserLang?.match(/en|pl/) ? browserLang : 'pl';
    this.selectedLanguage = this.languages.find(lang => lang.key === useLang);
  }
}

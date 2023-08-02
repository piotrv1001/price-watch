import { Inject, Injectable } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private themeSub: Subject<boolean> = new Subject<boolean>();
  constructor(@Inject(DOCUMENT) private document: Document) {}

  switchTheme(theme: string) {
    const themeLink = this.document.getElementById(
      'app-theme'
    ) as HTMLLinkElement;

    if (themeLink) {
      themeLink.href = theme + '.css';
      if(theme === 'lara-light-blue') {
        this.themeSub.next(false);
      } else if(theme === 'lara-dark-blue') {
        this.themeSub.next(true);
      }
    }
  }

  getTheme(): Observable<boolean> {
    return this.themeSub.asObservable();
  }
}

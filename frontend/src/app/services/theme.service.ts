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
    const newHref = theme + '.css';
    this.replaceThemeLink(newHref, () => {
      console.log('theme loaded');
      if (theme === 'lara-light-blue') {
        this.themeSub.next(false);
      } else if (theme === 'lara-dark-blue') {
        this.themeSub.next(true);
      }
    });
  }

  getTheme(): Observable<boolean> {
    return this.themeSub.asObservable();
  }

  private replaceThemeLink(href: string, onComplete: Function) {
    const id = 'app-theme';
    const themeLink = <HTMLLinkElement>this.document.getElementById(id);
    const cloneLinkElement = <HTMLLinkElement>themeLink.cloneNode(true);
    cloneLinkElement.setAttribute('href', href);
    cloneLinkElement.setAttribute('id', id + '-clone');
    themeLink.parentNode!.insertBefore(cloneLinkElement, themeLink.nextSibling);
    cloneLinkElement.addEventListener('load', () => {
      themeLink.remove();
      cloneLinkElement.setAttribute('id', id);
      onComplete();
    });
  }
}

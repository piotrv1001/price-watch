import { Observable } from 'rxjs';
import { Subject } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class SharedService {
  private signOutSub: Subject<void> = new Subject<void>();

  getSignOut(): Observable<void> {
    return this.signOutSub.asObservable();
  }

  signOut(): void {
    this.signOutSub.next();
  }

}

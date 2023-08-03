import { Injectable } from "@angular/core";
import { Observable, Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class ChosenSellerService {
  private sellerNameSubject: Subject<string> = new Subject<string>();

  getCurrentSeller(): Observable<string> {
    return this.sellerNameSubject.asObservable();
  }

  setCurrentSeller(sellerName: string): void {
    this.sellerNameSubject.next(sellerName);
  }
}

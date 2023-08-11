import { Component } from "@angular/core";
import { Seller } from "src/app/models/seller/seller";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent {
  currentSeller: Seller | null = null;

  handleSellerChange(seller: Seller): void {
    this.currentSeller = seller;
  }
}

import { Component, OnInit } from '@angular/core';
import { Seller } from 'src/app/models/seller/seller';

@Component({
  selector: 'app-sellers',
  templateUrl: './sellers.component.html',
  styleUrls: ['./sellers.component.scss']
})
export class SellersComponent implements OnInit {
  currentSeller: Seller | null = null;

  ngOnInit(): void {
    this.currentSeller = { id: 1, name: 'SmartLED' };
  }
}

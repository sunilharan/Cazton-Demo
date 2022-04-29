import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-price-level',
  templateUrl: './price-level.component.html',
  styleUrls: ['./price-level.component.scss'],
})
export class PriceLevelComponent implements OnInit {
  @Input() price: number = null;
  public priceLevelArray = [];

  constructor() {}

  ngOnInit() {
    this.setPrice();
  }

  setPrice() {
    this.priceLevelArray = [];
    for (let index = 0; index <= this.price; index++) {
      this.priceLevelArray.push(index);
    }
  }
}

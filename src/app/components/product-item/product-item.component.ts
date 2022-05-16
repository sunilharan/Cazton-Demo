import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Dishes } from 'src/app/interfaces/category.model';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-product-item',
  templateUrl: './product-item.component.html',
  styleUrls: ['./product-item.component.scss'],
})
export class ProductItemComponent implements OnInit {
  @Input() item: Dishes = null;
  @Input() type: 'desert' | 'softdrinks' | 'pizza';
  @Output() itemSelect: EventEmitter<any> = new EventEmitter();
  constructor(private cartService: CartService) {}

  get checkExists() {
    return this.cartService.checkItemIsExistInCartOrNot(this.item.id);
  }
  ngOnInit() {}

  fixEncoding(text: string): string {
    let outT = text?.split('&quot;')?.join('"');
    // eslint-disable-next-line @typescript-eslint/quotes
    outT = outT?.split('&#039;')?.join("'");
    outT = outT?.split('&amp;')?.join('&');
    return outT;
  }
}

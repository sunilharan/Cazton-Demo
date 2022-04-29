import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Category, Dishes } from 'src/app/interfaces/category.model';
import { SwiperOptions } from 'swiper';
import SwiperCore, { Pagination } from 'swiper';
SwiperCore.use([Pagination]);
@Component({
  selector: 'app-category-card',
  templateUrl: './category-card.component.html',
  styleUrls: ['./category-card.component.scss'],
})
export class CategoryCardComponent implements OnInit {
  @Input() category: Category;
  @Output()
  categorySelect: EventEmitter<any> = new EventEmitter();
  @Output()
  // eslint-disable-next-line @angular-eslint/no-output-on-prefix
  onItemSelect: EventEmitter<Dishes> = new EventEmitter();
  public slideOptions: SwiperOptions = {
    slidesPerView: 1,
    pagination: {
      dynamicBullets: false,
    },
  };

  constructor() {}

  ngOnInit() {}
}

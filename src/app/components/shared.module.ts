import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header/header.component';
import { BusinessCardComponent } from './business-card/business-card.component';
import { TranslateModule } from '@ngx-translate/core';
import { IonicModule } from '@ionic/angular';
import { PriceLevelComponent } from './price-level/price-level.component';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { LocationSelectComponent } from './location-select/location-select.component';
import { FilterComponent } from './filter/filter.component';
import { FormsModule } from '@angular/forms';
import { RestaurantInformationComponent } from './restaurant-information/restaurant-information.component';
import { CategoryCardComponent } from './category-card/category-card.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { SwiperModule } from 'swiper/angular';
import { AddTipComponent } from './add-tip/add-tip.component';

const COMPONENTS = [
  HeaderComponent,
  BusinessCardComponent,
  PriceLevelComponent,
  LocationSelectComponent,
  FilterComponent,
  RestaurantInformationComponent,
  CategoryCardComponent,
  ProductItemComponent,
  AddTipComponent,
];

@NgModule({
  declarations: [COMPONENTS],
  imports: [
    CommonModule,
    IonicModule,
    TranslateModule.forChild(),
    LazyLoadImageModule,
    FormsModule,
    SwiperModule,
  ],
  exports: [COMPONENTS],
})
export class SharedModule {}

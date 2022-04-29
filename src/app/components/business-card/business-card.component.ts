import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewEncapsulation,
} from '@angular/core';
import { WishlistRestaurant } from 'src/app/interfaces/restaurant.model';
import { LanguageService } from 'src/app/services/language.service';
import { WishlistService } from 'src/app/services/wishlist.service';
import { CommonUiService } from 'src/app/services/common-ui.service';

@Component({
  selector: 'app-business-card',
  templateUrl: './business-card.component.html',
  styleUrls: ['./business-card.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class BusinessCardComponent implements OnInit {
  @Input() restaurant = null;
  @Input() page: 'home' | 'category' | 'mapbox' = 'home';
  @Output() cardClicked: EventEmitter<any> = new EventEmitter();
  public showNotificationText = false;
  public showDisableText = false;
  public slideOptions = {
    slidesPerView: 1,
  };
  public showMore = false;
  constructor(
    private languageService: LanguageService,
    private wishlistService: WishlistService,
    private uiService: CommonUiService
  ) {}

  get isItemWishListed() {
    return this.wishlistService.check_wishlisted_or_not(this.restaurant?.id);
  }

  ngOnInit() {
    this.showDisableText =
      !this.restaurant?.enabled && this.restaurant?.disabledtext ? true : false;
    this.showNotificationText = this.restaurant?.notificationtext
      ? true
      : false;
  }

  addToWishlist() {
    this.wishlistService.add(this.restaurant as WishlistRestaurant);
    setTimeout(() => {
      this.uiService.showToast(
        this.languageService.getVal('item-added-from-wishlist'),
        'success'
      );
    }, 200);
  }

  async removeFromWishlist() {
    const action = await this.uiService.showConfirmationAlert(
      this.languageService.getVal('wishlist'),
      this.languageService.getVal('wishlist-item-remove-confirmation')
    );
    if (action?.action === 'CONFIRM') {
      this.wishlistService.remove(this.restaurant as WishlistRestaurant);
      setTimeout(() => {
        this.uiService.showToast(
          this.languageService.getVal('item-removed-from-wishlist'),
          'success'
        );
      }, 200);
    }
  }
  closeToast(type: 'notificationtext' | 'disabledtext') {
    /*  if ('notificationtext') {
      this.showNotificationText = false;
    }
    if ('disabledtext') {
      this.showDisableText = false;
    } */
  }
}

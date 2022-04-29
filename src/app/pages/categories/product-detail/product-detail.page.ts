/* eslint-disable @typescript-eslint/prefer-for-of */
/* eslint-disable guard-for-in */
/* eslint-disable no-bitwise */
/* eslint-disable eqeqeq */
/* eslint-disable prefer-arrow/prefer-arrow-functions */
/* eslint-disable @typescript-eslint/member-ordering */
import {
  ChangeDetectorRef,
  Component,
  Input,
  OnDestroy,
  OnInit,
} from '@angular/core';
import {
  AlertController,
  IonCheckbox,
  ModalController,
  Platform,
} from '@ionic/angular';
import { Subject } from 'rxjs';
import { CartItem } from 'src/app/interfaces/cart.model';
import {
  Choices,
  Dishes,
  Extras,
  OptionGroups,
  Variants,
} from 'src/app/interfaces/category.model';
import { CartService } from 'src/app/services/cart.service';
import { LanguageService } from 'src/app/services/language.service';
import { CommonUiService } from 'src/app/services/common-ui.service';
import { Haptics, ImpactStyle } from '@capacitor/haptics';
import { CommonDataService } from 'src/app/services/common-data.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.page.html',
  styleUrls: ['./product-detail.page.scss'],
})
export class ProductDetailPage implements OnInit, OnDestroy {
  @Input() dishId: number | string = null;
  @Input() preSelectOrderDate: string | null = null;
  @Input() mode: 'ADD' | 'EDIT' = 'ADD';
  @Input() cartItem: CartItem = null;
  @Input() restaurantId: number | string = null;

  @Input() dish: Dishes = null;
  public extras: Extras[] = [];

  public isLoading = false;
  private sholdStopSubscription: Subject<any> = new Subject();
  private shouldDetectChanges = false;

  public selectedVariant: Variants = null;
  public selectedExtrasOptionsList: OptionGroups[] = [];
  public comments: string = null;

  public isSizeOpen = true;

  public itemCount = 0;

  /**
   *
   * array['variantId']['optionId'] = {values}`radio button` | values[]`checkbox`
   */
  public selectedItems = [];

  constructor(
    public uiService: CommonUiService,
    private modalController: ModalController,
    private platform: Platform,
    private alertController: AlertController,
    private translateConfig: LanguageService,
    private cartService: CartService,
    private cdRef: ChangeDetectorRef,
    private commonDataService: CommonDataService
  ) {}

  ngOnInit() {
    if (this.dishId) {
      this.loadData(this.dishId, this.preSelectOrderDate);
    }
    this.shouldDetectChanges = true;
  }

  ngOnDestroy() {
    this.sholdStopSubscription?.next();
    this.sholdStopSubscription?.complete();
    this.shouldDetectChanges = false;
  }

  detectChanges() {
    if (this.shouldDetectChanges) {
      this.cdRef.detectChanges();
    }
  }

  get mainPrice(): number {
    let price = 0;
    price += this.selectedVariant.price;
    for (const key in this.selectedItems[this.selectedVariant.rank]) {
      if (
        Object.prototype.hasOwnProperty.call(
          this.selectedItems[this.selectedVariant.rank],
          key
        )
      ) {
        const element = this.selectedItems[this.selectedVariant.rank][key];
        if (typeof element === 'object') {
          if (Array.isArray(element)) {
            if (element?.length > 0) {
              element.forEach((e) => {
                const op = this.getOption(e);
                if (op.showoptions) {
                  price += e?.price;
                }
              });
            }
          } else {
            const op = this.getOption(element);
            if (op.showoptions) {
              price += element?.price;
            }
          }
        }
      }
    }
    return price * this.itemCount;
  }

  loadData(id: number | string, date: string | null) {
    this.dish = { ...this.commonDataService.dish, ...this.dish };
    if (this.dish?.id) {
      if (this.mode == 'ADD') {
        this.setPreselectVariant();
        this.initializeSelectedItems();
        this.getOptionGroupList();
        this.itemCount = 1;
      } else if (this.mode == 'EDIT') {
        if (this.cartItem?.id) {
          this.dish = this.cartItem?.dish;
          this.setPreselectVariant(this.cartItem?.variant);
          this.initializeSelectedItems();
          this.getOptionGroupList();
          this.comments = this.cartItem?.comment;
          setTimeout(() => {
            this.itemCount = this.cartItem?.quantity;
            this.selectedItems[this.selectedVariant?.rank] = {};
            this.selectedItems[this.selectedVariant?.rank] = {
              ...this.cartItem.selectedItems,
            };
            this.detectChanges();
          }, 500);
        }
      }
    }
  }

  private setPreselectVariant(variant: Variants = null) {
    if (!variant?.rank) {
      const selectedVariant = this.dish?.variants.filter(
        (e) => e.preselect !== false
      );
      this.selectedVariant = selectedVariant?.length
        ? selectedVariant[0]
        : null;
    } else {
      this.selectedVariant = variant;
    }
    this.extras = this.dish?.extras;
    this.extras?.forEach((e) =>
      e?.optiongroups?.forEach((opt) => {
        opt.showoptions = true;
        if (opt.conditional) {
          opt.showoptions = false;
        }
      })
    );

    this.fillWithEmptyChoices();
    this.detectChanges();
  }

  private initializeSelectedItems() {
    if (this.dish?.variants?.length > 0) {
      this.dish?.variants.forEach((v) => {
        this.selectedItems[v.rank] = {};
      });
    }
    if (this.selectedVariant?.rank) {
      this.selectedItems[this.selectedVariant?.rank] = {};
    }
    this.detectChanges();
  }

  private getOptionGroupList() {
    if (this.selectedVariant && this.selectedVariant?.extras?.length > 0) {
      this.selectedVariant?.extras?.forEach((extrasId) => {
        const extras: Extras = this.extras.filter((e) => e.id === extrasId)
          .length
          ? this.extras.filter((e) => e.id === extrasId)[0]
          : null;
        if (extras) {
          extras.optiongroups?.forEach((options) => {
            this.selectedExtrasOptionsList = [
              ...this.selectedExtrasOptionsList,
              { ...options },
            ];
          });
        }
      });
    }
    this.fillWithEmptyChoices();
    this.detectChanges();
  }

  private fillWithEmptyChoices() {
    this.selectedExtrasOptionsList.forEach((opGroup) => {
      if (opGroup.max_sel == 1 && opGroup.min_sel == 1) {
        const emptyChoice = {
          name: '',
          id: 0,
          price: 0,
          rank: 0,
        };
        this.selectedItems[this.selectedVariant.rank]['opt' + opGroup.id] = [];
      }
    });
  }

  public choiceChecked(choice: Choices, selectedChoices: Choices[]): boolean {
    if (selectedChoices && choice) {
      for (let i = 0; i < selectedChoices.length; i++) {
        if (choice.id == selectedChoices[i].id) {
          return true;
        }
      }
    }
    return false;
  }

  private getChoiceById(id: number): Choices {
    let choice: Choices = null;
    if (this.selectedExtrasOptionsList) {
      for (let i = 0; i < this.selectedExtrasOptionsList.length; i++) {
        const choices: Choices[] = this.selectedExtrasOptionsList[
          i
        ].choices.filter((c) => c.id == id);
        if (choices.length > 0) {
          choice = choices[0];
          break;
        }
      }
    }
    return choice;
  }

  private getVariantByRank(rank: number): Variants {
    let variant: Variants = null;
    if (this.dish.variants) {
      for (let i = 0; i < this.dish.variants.length; i++) {
        if (rank == this.dish.variants[i].rank) {
          variant = this.dish.variants[i];
        }
      }
    }
    return variant;
  }

  onRadioButtonChange(ev, option: OptionGroups) {
    const choiceId: number = ev.detail.value;
    if (choiceId) {
      this.selectedExtrasOptionsList.forEach((extras) => {
        if (option.id == extras.dependson?.option) {
          extras.showoptions = false;

          //remove selected
        }
        if (extras.dependson?.choice == choiceId) {
          extras.showoptions = true;
        }
      });
    }
  }

  updateDependencies(choice: Choices, option: OptionGroups, checked: boolean) {
    if (choice) {
      this.selectedExtrasOptionsList.forEach((extras) => {
        if (extras.dependson?.choice == choice.id) {
          extras.showoptions = checked;
        }
      });
    }
  }

  async back() {
    await this.modalController.dismiss(null, 'CLOSE');
  }

  getUnfullfilled(): OptionGroups {
    for (const key in this.selectedExtrasOptionsList) {
      const option = this.selectedExtrasOptionsList[key];
      if (option.min_sel > 0 && option.showoptions) {
        const element =
          this.selectedItems[this.selectedVariant.rank]['opt' + option.id];
        if (element) {
          if (typeof element === 'object') {
            if (Array.isArray(element)) {
              if (element?.length < option.min_sel) {
                return option;
              }
            }
          } else {
            return option;
          }
        } else {
          return option;
        }
      }
    }
    return null;
  }

  async saveChanges() {
    const option = this.getUnfullfilled();
    if (option == null) {
      if (this.mode == 'ADD') {
        await this.addToCart();
      } else if (this.mode == 'EDIT') {
        await this.editCartItem(this.cartItem);
      }
    } else {
      option.unfulfilled = true;
      this.uiService.showToast(
        this.translateConfig.getVal('missing-options') + option.min_sel,
        'danger'
      );
    }
  }

  async addToCart() {
    if (this.itemCount > 0) {
      const restuarntId = this.cartService.getRestaurantId();
      if (restuarntId) {
        if (this.restaurantId == restuarntId) {
          this.proceedToCart();
        } else {
          this.uiService.showToast(
            this.translateConfig.getVal('restaurant-mis-match'),
            'danger'
          );
          return;
        }
      } else {
        this.cartService.setRestaurantId(this.restaurantId.toString());
        this.proceedToCart();
      }
    }
  }

  async proceedToCart() {
    const cartItem: CartItem = this.createCartObject();
    this.cartService.add(cartItem, this.preSelectOrderDate);
    if (this.platform.is('capacitor')) {
      try {
        Haptics.vibrate();
      } catch (error) {}
    }
    await this.modalController.dismiss(null, 'ADD_TO_CART');
  }

  async editCartItem(item: CartItem) {
    const cartItem: CartItem = this.createCartObject(item);
    this.cartService.edit(cartItem);
    await this.modalController.dismiss(null, 'ADD_TO_CART');
  }

  private getOption(choice: any): OptionGroups {
    for (const key in this.selectedExtrasOptionsList) {
      const option = this.selectedExtrasOptionsList[key];
      for (const optKey in option.choices) {
        const choiceF = option.choices[optKey];
        if (choice.id == choiceF.id) {
          return option;
        }
      }
    }
    return null;
  }

  private createCartObject(item: CartItem = null) {
    const cartItem: CartItem = {};
    cartItem.id = item?.id ? item?.id : this.uuid();
    cartItem.price = this.mainPrice;
    cartItem.dish = this.dish;
    cartItem.dishId = this.dish.id;
    cartItem.variantId = this.selectedVariant.rank;
    cartItem.variant = this.selectedVariant;
    cartItem.extras = [];
    cartItem.extrasId = [];
    cartItem.toppings = [];
    cartItem.quantity = this.itemCount;
    cartItem.comment = this.comments;
    cartItem.selectedItems = {
      ...this.selectedItems[this.selectedVariant.rank],
    };
    for (const key in this.selectedItems[this.selectedVariant.rank]) {
      if (
        Object.prototype.hasOwnProperty.call(
          this.selectedItems[this.selectedVariant.rank],
          key
        )
      ) {
        const element = this.selectedItems[this.selectedVariant.rank][key];
        if (typeof element === 'object') {
          if (Array.isArray(element)) {
            if (element?.length > 0) {
              element.forEach((e) => {
                const op = this.getOption(e);
                if (op.showoptions) {
                  cartItem.extras = [...cartItem.extras, e];
                  cartItem.extrasId = [...cartItem.extrasId, e.id];
                  cartItem.toppings = [...cartItem.toppings, e.name];
                }
              });
            }
          } else {
            const op = this.getOption(element);
            if (op.showoptions) {
              cartItem.extras = [...cartItem.extras, element];
              cartItem.extrasId = [...cartItem.extrasId, element.id];
              cartItem.toppings = [...cartItem.toppings, element.name];
            }
          }
        }
      }
    }
    return cartItem;
  }

  selectVariant(ev) {
    //const selectedValue: Variants = ev?.detail?.value;
    /*   const rank: number = ev?.detail?.value;
    this.selectedVariant = this.getVariantByRank(rank); */
    const index: number = ev?.detail?.value;
    this.selectedVariant = this.dish?.variants[index];
    const selectedValue: Variants = this.selectedVariant;
    if (selectedValue) {
      this.selectedExtrasOptionsList = [];
      this.selectedItems[this.selectedVariant.rank] = {};
      this.itemCount = 1;
      if (selectedValue.extras?.length) {
        selectedValue.extras?.forEach((extrasId) => {
          const extras: Extras = this.extras.filter((e) => e.id === extrasId)
            .length
            ? this.extras.filter((e) => e.id === extrasId)[0]
            : null;
          if (extras) {
            extras.optiongroups?.forEach((options) => {
              this.selectedExtrasOptionsList = [
                ...this.selectedExtrasOptionsList,
                { ...options },
              ];
            });
          }
        });
      }
    }

    this.fillWithEmptyChoices();
  }

  changeChoice(ev, option: OptionGroups) {
    this.clearUnfulfilled();
    const checked: boolean = ev?.detail?.checked;
    const choiceId: number = ev?.detail?.value;

    const choice: Choices = this.getChoiceById(choiceId);
    this.selectedItems[this.selectedVariant.rank]['opt' + option.id] = choice;
    this.onRadioButtonChange(ev, option);
  }

  choiceAddAllowed(choice: Choices, option: OptionGroups): boolean {
    const min = option.min_sel;
    const max = option.max_sel;
    const curCount =
      this.selectedItems[this.selectedVariant.rank]['opt' + option.id].length +
      1;
    if (curCount > max && !this.choiceAlreadySelected(choice, option)) {
      return false;
    } else {
      return true;
    }
  }

  choiceAlreadySelected(choice: Choices, option): boolean {
    const choiceF = this.selectedItems[this.selectedVariant.rank][
      'opt' + option.id
    ].find((obj) => obj.id == choice.id);

    if (choiceF) {
      return true;
    }

    return false;
  }

  clearUnfulfilled() {
    for (const key in this.selectedExtrasOptionsList) {
      const option = this.selectedExtrasOptionsList[key];
      option.unfulfilled = false;
    }
  }

  addRemoveExtras(ev, option: OptionGroups) {
    this.clearUnfulfilled();
    const checked: boolean = ev?.detail?.checked;
    const choiceId: number = ev?.detail?.value;
    const choice = this.getChoiceById(choiceId);
    if (
      !this.selectedItems[this.selectedVariant.rank]['opt' + option.id]?.length
    ) {
      this.selectedItems[this.selectedVariant.rank]['opt' + option.id] = [];
    }

    if (checked) {
      if (this.choiceAddAllowed(choice, option)) {
        if (
          this.selectedItems[this.selectedVariant.rank].hasOwnProperty([
            'opt' + option.id,
          ])
        ) {
          const choiceAdded = this.selectedItems[this.selectedVariant.rank][
            'opt' + option.id
          ].find((obj) => obj.id == choice.id);
          if (!choiceAdded?.id) {
            this.selectedItems[this.selectedVariant.rank]['opt' + option.id] = [
              ...this.selectedItems[this.selectedVariant.rank][
                'opt' + option.id
              ],
              choice,
            ];
          }
        } else {
          this.selectedItems[this.selectedVariant.rank][
            'opt' + option.id
          ]?.push(choice);
        }
        this.updateDependencies(choice, option, checked);
      } else {
        const ch: IonCheckbox = ev?.target;
        ch.checked = false;
        this.uiService.showToast(
          this.translateConfig.getVal('to-much-options') + option.max_sel,
          'danger'
        );
      }
    } else {
      this.selectedItems[this.selectedVariant.rank]['opt' + option.id] =
        this.selectedItems[this.selectedVariant.rank][
          'opt' + option.id
        ]?.filter((e) => e.id !== choice.id);

      this.updateDependencies(choice, option, checked);
    }
  }

  async presentAddCommentsAlert() {
    const alert = await this.alertController.create({
      header: this.translateConfig.getVal('add-comment'),
      message: '',
      cssClass: 'add-comments-alert',
      inputs: [
        {
          name: 'comment',
          id: 'comment',
          type: 'text',
          placeholder: this.translateConfig.getVal('add-comment'),
          value: this.comments,
        },
      ],
      buttons: [
        {
          text: this.translateConfig.getVal('cancel'),
          role: 'cancel',
          handler: () => {},
        },
        {
          text: this.translateConfig.getVal('add'),
          role: 'add',
          handler: (ev) => {
            if (ev && ev?.comment) {
              this.comments = ev?.comment;
            } else {
              if (!ev?.comment) {
                this.comments = null;
              }
            }
          },
        },
      ],
    });

    await alert.present();
  }

  async addRemoveItemCount(incre: boolean = false) {
    if (!this.selectedVariant?.rank) {
      this.uiService.showToast(
        this.translateConfig.getVal('choose-size-error'),
        'danger'
      );
      return;
    }
    if (incre) {
      this.itemCount += 1;
    } else {
      if (this.itemCount) {
        const count = this.itemCount - 1;
        if (this.mode == 'EDIT' && count === 0) {
          const confirm = await this.uiService.showConfirmationAlert(
            this.translateConfig.getVal('cart'),
            this.translateConfig.getVal('delete-cart-item-confirmation')
          );
          if (confirm.action == 'CONFIRM') {
            this.cartService.remove(this.cartItem);
            return await this.modalController.dismiss();
          } else {
            return;
          }
        }
        this.itemCount -= 1;
      }
    }
    if (this.platform.is('capacitor')) {
      try {
        Haptics.impact({
          style: ImpactStyle.Light,
        });
        Haptics.vibrate();
      } catch (error) {}
    }
  }

  uuid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
      /[xy]/g,
      // eslint-disable-next-line space-before-function-paren
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c == 'x' ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }
}

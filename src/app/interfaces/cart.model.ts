import { Dishes, Extras, Variants } from "./category.model";

export interface CartDetail {
  count: number;
  price: number;
}

export interface CartItem {
  id?: string;
  dishId?: number;
  variantId?: string | number;
  variant?: Variants;
  extrasId?: string[] | number[];
  extras?: Extras[];
  quantity?: number | null;
  dish?: Dishes;
  comment?: string;
  price?: number;
  toppings?: string[];
  selectedItems?: any;
}

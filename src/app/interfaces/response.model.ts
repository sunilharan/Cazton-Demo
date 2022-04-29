export interface ApiResponse {
  success: boolean;
  message: string;
  data: any;
}

export interface CouponResponse {
  coupon: string;
  minimum: number;
  type: 'relative' | 'absolute';
  absolutevalue: number;
  relativevalue: number;
  restricttodishes: boolean;
  dishes?: number[];
  freedelivery: boolean;
  delivery: boolean;
  pickup: boolean;
}

export interface TipsModel {
  amount: number;
  selected: boolean;
}

export const tipsList: TipsModel[] = [
  {
    amount: 50,
    selected: false,
  },
  {
    amount: 100,
    selected: false,
  },
  {
    amount: 200,
    selected: false,
  },
  { amount: 300, selected: false },
];

export interface Order {
  business: number;
  name: string;
  lastname: string;
  email: string;
  telephone: string;
  os: string;
  dishes: {
    id: number;
    comment?: string;
    variant: string | number;
    extras: number[];
    count: number;
  }[];
  total: number;
  deliverytype: 'pickup' | 'delivery';
  payment: string;
  shipping?: number;
  /* street?: string;
  number?: string;
  city?: string;
  zip?: string; */
  address?: string;
  comment?: string;
  coupon?: string;
  preordertime?: string;
  tip?: number;
  platform: number;
  newsletter: boolean;
}

export interface OrderHistoryModel {
  id: number;
  business: {
    name?: string;
    address?: string;
    telephone?: string;
    logo?: string;
  };
  ordertime: string;
  delivertime: string;
  payment: string;
  customer: {
    name?: string;
    address?: string;
    telephone?: string;
    email?: string;
    deliveryType?: string;
  };
  dishes: {
    name?: string;
    variant?: string;
    extras?: string[];
    comment?: string;
    total?: number;
    qty?: any;
  }[];
  shipping?: number;
  total?: number;
  status: number;
}

export interface OrderSummaryModel {
  status: 'success' | 'rejected' | 'pending';
  comment?: string;
  preorder?: boolean;
  readyInMin?: number;
  readyDate?: string;
  readyTime?: string;
  deliverType: 'pickup' | 'delivery';
}

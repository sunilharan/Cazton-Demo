export interface Category {
  name?: string;
  id?: number;
  description?: string;
  rank?: number;
  hasimage?: boolean;
  images?: string[];
  image?: string;
  dishes?: Dishes[];
  allDishes?: Dishes[];
  subcategories?: SubCategory[];
}

export interface SubCategory {
  name?: string;
  id?: number;
  description?: string;
  rank?: number;
  hasimage?: boolean;
  images?: string[];
  dishes?: Dishes[];
  allDishes?: Dishes[];
}

export interface Dishes {
  name?: string;
  price?: number;
  description?: string;
  hasimage?: boolean;
  rank?: number;
  id?: number;
  image?: string;
  tags?: { icon: string; name: string }[];
  ingredients?: string;
  hasextras?: boolean;
  excludeminimum?: boolean;
  pricestring?: string;
  variants?: Variants[];
  extras?: Extras[];
}

export interface Variants {
  name?: string;
  price?: number;
  extras?: number[];
  preselect?: boolean;
  rank?: number;
  index?: number;
}

export interface Extras {
  id?: number;
  optiongroups?: OptionGroups[];
}

export interface OptionGroups {
  id?: number;
  text?: string;
  conditional?: boolean;
  rank?: number;
  max_sel?: number;
  min_sel?: number;
  expanded?: boolean;
  dependson?: {
    choice?: number | string;
    option?: number | string;
  };
  choices?: Choices[];
  showoptions?: boolean;
  unfulfilled?: boolean;
}

export interface Choices {
  name?: string;
  id?: number;
  price?: number;
  rank?: number;
}

export const CategoriesList = [
  /* {
    id: 1,
    name: "healthy-food",
    icon: "assets/icons/category-icon/001-healthy-food.svg",
  }, */
  {
    id: 1,
    name: 'pizza',
    icon: 'assets/icons/category-icon/009-pizza.svg',
  },
  {
    id: 2,
    name: 'meat',
    icon: 'assets/icons/category-icon/002-meat.svg',
  },
  {
    id: 3,
    name: 'veggie',
    icon: 'assets/icons/category-icon/003-veggie.svg',
  },
  {
    id: 4,
    name: 'carrots',
    icon: 'assets/icons/category-icon/004-carrots.svg',
  },
  {
    id: 5,
    name: 'broccoli',
    icon: 'assets/icons/category-icon/005-broccoli.svg',
  },
  {
    id: 6,
    name: 'tuna',
    icon: 'assets/icons/category-icon/006-tuna.svg',
  },
  {
    id: 7,
    name: 'healthy-living',
    icon: 'assets/icons/category-icon/007-healthy-living.svg',
  },
  {
    id: 8,
    name: 'cuba-libre',
    icon: 'assets/icons/category-icon/008-cuba-libre.svg',
  },
];

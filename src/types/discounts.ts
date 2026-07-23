import type { Product } from './products';

export interface Discount {
  endDate: string;
  products: Product[];
  startDate: string;
  title: string;
  type: 'percentage' | 'amount';
  value: number;
  _id: string;
}

import type { Product } from './products';
import type { User } from './user';

export interface PromoCode {
  code: string;
  endDate: string | null;
  productSelection: 'general' | 'selected';
  products: Product[];
  startDate: string;
  type: 'amount' | 'percentage';
  userSelection: 'general' | 'selected';
  users: User[];
  value: number;
  _id: string;
}

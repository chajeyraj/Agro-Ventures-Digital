export interface Category {
  id: string;
  name: string;
  user_id: string | null;
}

export interface Expense {
  id: string;
  user_id: string;
  title: string;
  amount: number;
  category: string;
  created_at: string;
}

export const DEFAULT_CATEGORIES = ['Food', 'Travel', 'Bills', 'Shopping', 'Other'];

// src/types/types.ts

export type RipenessStatus = 'none' | 'green' | 'ripe/mature' | 'advanced' | 'too ripe';

export interface Ingredient {
  id: string;
  name: string;
  brand?: string;
  addedOn: string;
  category?: string;
  location?: string;
  confectionType?: string;
  expirationDate?: string;
  isFrozen: boolean;
  open?: {
    status: boolean;
    openedOn?: string;
  };
  ripeness?: {
    status: RipenessStatus;
    lastChecked: string;
  };
  quantity?: {
    value: number;
    unit: string;
  };
}

export interface GroceryItem {
    id: string;
    name: string;
}
import { FuelType } from '@/types/crowdFuelResponse';
import { create } from 'zustand';

export interface OrderDetails {
  stationId: string;
  stationName: string;
  stationAddress: string;
  deliveryAddress: string | null;
  fuelType: FuelType;
  quantity: number;
  pricePerLiter: number;
  totalAmount: number;
}

interface OrderStoreState {
  order: OrderDetails | null;
  setOrder: (order: OrderDetails) => void;
  updateOrder: (updates: Partial<OrderDetails>) => void;
  clearOrder: () => void;
}

export const useOrderStore = create<OrderStoreState>((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
  updateOrder: (updates) =>
    set((state) =>
      state.order ? { order: { ...state.order, ...updates } } : state
    ),
  clearOrder: () => set({ order: null }),
}));

import { FuelType } from '@/types/crowdFuelResponse';
import { create } from 'zustand';

interface Order {
  stationId: string;
  stationName: string;
  stationAddress: string;
  fuelType: FuelType;
  quantity: number;
  pricePerLiter: number;
  totalPrice: number;
}

export const useOrderStore = create<{
  order: Order | null;
  setOrder: (order: Order) => void;
  clearOrder: () => void;
}>((set) => ({
  order: null,
  setOrder: (order) => set({ order }),
  clearOrder: () => set({ order: null }),
}));

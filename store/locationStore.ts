import { create } from 'zustand';

interface LocationState {
  address: string;
  lga: string;
  setAddress: (address: string) => void;
  setLga: (lga: string) => void;
}

export const useLocationStore = create<LocationState>((set) => ({
  address: '',
  lga: '',
  setAddress: (address: string) => set({ address }),
  setLga: (lga: string) => set({ lga }),
}));

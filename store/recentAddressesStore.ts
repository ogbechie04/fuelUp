import { create } from 'zustand';

interface RecentAddressStore {
  recentAddresses: string[];
  addAddress: (address: string) => void;
}

export const useRecentAddressStore = create<RecentAddressStore>((set) => ({
  recentAddresses: [],
  addAddress: (newAddress) =>
    set((state) => {
      const updated = [
        newAddress,
        ...state.recentAddresses.filter((a) => a !== newAddress),
      ];
      return { recentAddresses: updated.slice(0, 10) };
    }),
}));

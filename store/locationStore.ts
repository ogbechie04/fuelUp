import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface LocationState {
  address: string;
  lga: string;
  setAddress: (address: string) => Promise<void>;
  setLga: (lga: string) => Promise<void>;
  loadLocation: () => Promise<void>;
}

export const useLocationStore = create<LocationState>((set) => ({
  address: '',
  lga: '',
  setAddress: async (address: string) => {
    set({ address });
    await AsyncStorage.setItem('user_address', address);
  },

  setLga: async (lga: string) => {
    set({ lga });
    await AsyncStorage.setItem('lga', lga);
  },
  loadLocation: async () => {
    try {
      const [savedAddress, savedLga] = await Promise.all([
        AsyncStorage.getItem('user_address'),
        AsyncStorage.getItem('lga'),
      ]);
      if (savedAddress) set({ address: savedAddress });
      if (savedLga) set({ lga: savedLga });
    } catch (error) {
      console.error('Failed to load location from AsyncStorage', error);
    }
  },
}));

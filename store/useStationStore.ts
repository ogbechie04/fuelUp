import { create } from 'zustand';
import { StationCardTransformed } from '@/types/stationCardTransformed';

interface StationStore {
  stations: StationCardTransformed[];
  setStations: (stations: StationCardTransformed[]) => void;
  getStationsById: (id: string) => StationCardTransformed | undefined;
}

export const useStationStore = create<StationStore>((set, get) => ({
  stations: [],
  setStations: (stations) => set({ stations }),
  getStationsById: (id) => get().stations.find((station) => station.id === id),
}));

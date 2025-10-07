import { CrowdFuelResponse } from '@/types/crowdFuelResponse';
import {
  StationCardTransformed,
  stationImages,
} from '@/types/stationCardTransformed';
import mobilImage from '@/assets/images/mobil-station.png';

export const transformCrowdFuelData = (
  data: CrowdFuelResponse[]
): StationCardTransformed[] => {
  const stationMap = new Map<string, StationCardTransformed>();

  for (const entry of data) {
    const key = `${entry.fuel_station}-${entry.state}-${entry.city}`;
    const amount = parseFloat(entry.amount);

    if (!stationMap.has(key)) {
      stationMap.set(key, {
        id: `${entry.fuel_station}-${entry.state}-${entry.city}`,
        stationName: entry.fuel_station,
        state: entry.state,
        city: entry.city,
        image: stationImages[entry.fuel_station] ?? mobilImage,
        prices: {},
        availability: {},
      });
    }

    const station = stationMap.get(key)!;

    station.prices[entry.fuel_type] = amount;
    station.availability[entry.fuel_type] = true;
  }

  return Array.from(stationMap.values());
};

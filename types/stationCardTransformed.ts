import { ImageSourcePropType } from 'react-native';
import { FuelType } from './crowdFuelResponse';

export interface StationCardTransformed {
  id: string;
  stationName: string;
  state: string;
  city: string;
  image: ImageSourcePropType;
  prices: Partial<Record<FuelType, number>>;
  availability: Partial<Record<FuelType, boolean>>;
}

export const stationImages = () => {}

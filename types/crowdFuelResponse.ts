export enum FuelType {
  PETROL = 'petrol',
  DIESEL = 'diesel',
}

export interface CrowdFuelResponse {
  id: number;
  email: string;
  amount: string;
  fuel_type: FuelType;
  state: string;
  city: string;
  fuel_station: string;
  timestamp: string;
}

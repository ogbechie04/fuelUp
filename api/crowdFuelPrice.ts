import { API_BASE_URL } from '@env';

export const fetchCrowdFuelPrices = async () => {
  try {
    const response = await fetch('http://192.168.100.126:3000/crowd-fuel-price', {
      method: 'GET',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch fuel prices');
    }
    return await response.json();
  } catch (error) {
    console.log(error);
  }
};

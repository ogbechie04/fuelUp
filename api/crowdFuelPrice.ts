import { API_BASE_URL } from '@env';

export const fetchCrowdFuelPrices = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/crowd-fuel-price`, {
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

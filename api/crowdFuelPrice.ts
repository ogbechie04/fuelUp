export const fetchCrowdFuelPrices = async () => {
  const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;
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

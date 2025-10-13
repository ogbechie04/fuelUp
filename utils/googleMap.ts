const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

/**
 *
 * @getPlacePredictions for autocomplete of address predictions
 * @getPlaceDetails to get the details, full address of a place from its id
 * @param input
 * @returns
 */

export const getPlacePredictions = async (input: string): Promise<any[]> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${encodeURIComponent(
      input
    )}&key=${GOOGLE_API_KEY}&components=country:ng`
  );
  const data = await response.json();
  return data.predictions || [];
};

export const getPlaceDetails = async (
  placeId: string
): Promise<{ address: string; lat: number; lng: number }> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&key=${GOOGLE_API_KEY}`
  );
  const data = await response.json();
  const location = data.result.geometry.location;
  return {
    address: data.result.formatted_address,
    lat: location.lat,
    lng: location.lng,
  };
};

export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<{ address: string; city: string }> => {
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_API_KEY}`
  );
  const data = await response.json();
  const result = data.results?.[0];
  const address = result?.formatted_address || '';

  let city = '';
  if (result) {
    for (const comp of result.address_components) {
      if (comp.types.includes('administrative_area_level_2')) {
        city = comp.long_name;
        break;
      }
    }

    if (!city) {
      const localityComp = result.address_components.find((c: any) =>
        c.types.includes('locality')
      );
      city = localityComp?.long_name || '';
    }
  }

  return { address, city };
};

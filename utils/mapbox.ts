// import {MAPBOX_PUBLIC_TOKEN} from '@env'

const MAPBOX_TOKEN = process.env.MAPBOX_PUBLIC_TOKEN;

export type AddressSuggestion = {
  place_id: string;
  placeName: string;
  lat: number;
  lng: number;
  description: string;
};

export const fetchAddressSelections = async (
  query: string
): Promise<AddressSuggestion[]> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?autocomplete=true&country=NG&limit=5&access_token=${MAPBOX_TOKEN}`
  );
  const data = await response.json();
  return data.features.map((f: any) => ({
    id: f.id,
    placeName: f.place_name,
    lat: f.center[1],
    lng: f.center[0],
  }));
};
export const forwardGeocode = async (
  place: string
): Promise<{ lat: number; lng: number; address: string }> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      place
    )}.json?country=NG&access_token=${MAPBOX_TOKEN}`
  );
  console.log(`MAPBOX response:`, response);
  const data = await response.json();
  if (!data.features || data.features.length === 0) {
    console.warn('No features found for forward geocode');
    return { lat: 0, lng: 0, address: '' };
  }
  const [lng, lat] = data.features[0].center;
  console.log(lng, lat);
  return { lng, lat, address: data.features[0].place_name };
};

export const reverseGeocode = async (
  lat: number,
  lng: number
): Promise<{ address: string; city: string }> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
  );
  const data = await response.json();
  const address = data.features[0]?.place_name ?? '';
  const cityFeature =
    data.features.find((f: any) => f.place_type.includes('place')) ||
    data.features.find((f: any) => f.place_type.includes('locality')) ||
    data.features.find((f: any) => f.place_type.includes('region'));

  const city = cityFeature?.text ?? '';

  console.log(`revGeo data`, data);
  console.log(`revGeo address`, address);
  return { address, city };
};

export const getFullAddressFromCoords = async (
  lat: number,
  lng: number
): Promise<string> => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json?access_token=${MAPBOX_TOKEN}`
  );
  const data = await response.json();
  return data.features[0]?.place_name ?? '';
};

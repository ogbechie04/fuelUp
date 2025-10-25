import {
  ScrollView,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ArrowLeft from '@/assets/icon/arrow-left.svg';
import Search from '@/assets/icon/search-normal-outline.svg';
import Clock from '@/assets/icon/clock.svg';
import * as Location from 'expo-location';
import LocationIcon from '@/assets/icon/location.svg';
import { router } from 'expo-router';
import { useState } from 'react';
import { useLocationStore } from '@/store/locationStore';
import {
  forwardGeocode,
  fetchAddressSelections,
  type AddressSuggestion,
} from '@/utils/mapbox';
import { useRecentAddressStore } from '@/store/recentAddressesStore';
import debounce from 'lodash.debounce';
import {
  getPlaceDetails,
  getPlacePredictions,
  reverseGeocode,
} from '@/utils/googleMap';

export default function Address() {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<AddressSuggestion[]>([]);
  const setAddress = useLocationStore((s) => s.setAddress);
  const setLga = useLocationStore((s) => s.setLga);
  const { recentAddresses, addAddress } = useRecentAddressStore();

  const selectAddress = (address: string, lga: string) => {
    setAddress(address);
    setLga(lga);
    addAddress(address);
    setTimeout(() => {
      router.replace('/(tabs)');
    });
  };

  const handleCurrentLocation = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission denied', 'Location permission is required');
        return;
      }
      const loc = await Location.getCurrentPositionAsync({});
      const { address, city } = await reverseGeocode(
        loc.coords.latitude,
        loc.coords.longitude
      );

      selectAddress(address, city);
    } catch (err) {
      Alert.alert('Error', 'Unable to fetch location');
      console.log(err);
    }
  };

  const handleManualSearch = async () => {
    try {
      const { lat, lng, address } = await getPlaceDetails(query);
      const { city } = await reverseGeocode(lat, lng);

      selectAddress(address, city);
    } catch (err) {
      Alert.alert('Error', 'Could not find location');
      console.log(err);
    }
  };

  const fetchSuggestions = debounce(async (text: string) => {
    if (!text) return setSuggestions([]);
    const results = await getPlacePredictions(text);
    setSuggestions(results);
  }, 500);

  const handleSelectSuggestion = async (sug: AddressSuggestion) => {
    try {
      const { lat, lng, address } = await getPlaceDetails(sug.place_id);

      const { city } = await reverseGeocode(lat, lng);

      selectAddress(address, city);
      router.replace('/(tabs)');
    } catch (err) {
      Alert.alert('Error', 'Failed to select address');
      console.error('handleSelectSuggestion error:', err);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          {/* ------ back button ------ */}
          <TouchableOpacity
            className="mb-[24px] flex-row gap-[8px]"
            onPress={() => router.back()}
          >
            <ArrowLeft color={'#1A201D'} width={16} height={16} />
            <Text style={[styles.satoshiMedium]} className="text-[12px]">
              Delivery Address
            </Text>
          </TouchableOpacity>

          {/* ------ address search/input bar ------ */}
          <View
            className={`w-full flex-row-reverse justify-between rounded-lg border border-primaryLight bg-white px-[16px] py-3`}
          >
            <TextInput
              inputMode="text"
              placeholder="Choose your location"
              keyboardType="default"
              placeholderTextColor={'#D9D9D9'}
              className={`flex flex-1 justify-start pl-[8px]`}
              value={query}
              onChangeText={(text) => {
                setQuery(text);
                fetchSuggestions(text);
              }}
              onSubmitEditing={() => setSuggestions([])}
              returnKeyType="search"
              // secureTextEntry={!showPassword}
              // style={[styles.inputText]}
              // onBlur={onBlur}
            />
            <Search width={16} height={16} color={'#84868C'} />
          </View>

          {/* Suggestion dropdown */}
          {suggestions.length > 0 && (
            <View className="mt-2 rounded-md border border-gray-200 bg-white shadow">
              {suggestions.map((sug, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => handleSelectSuggestion(sug)}
                  className="border-b border-gray-200 py-[8px]"
                >
                  <Text>{sug.description}</Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {/* ------ use your location ------ */}
          <TouchableOpacity
            className="mt-[12px] flex-row gap-[8px]"
            onPress={handleCurrentLocation}
          >
            <LocationIcon width={16} height={16} color={`#0095C7`} />
            <Text style={[styles.satoshiMedium]} className="text-primaryNormal">
              Use your current location
            </Text>
          </TouchableOpacity>
        </View>

        {/* ------ recent addresses ------ */}
        <View className="mt-[24px]">
          {recentAddresses.map((item, index) => (
            <TouchableOpacity
              key={index}
              className="flex-row items-center gap-[8px] py-[12px]"
              onPress={() => selectAddress(item, '')}
            >
              <Clock width={16} height={16} color="#84868C" />
              <Text>{item}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    // alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  satoshi: {
    fontFamily: 'Satoshi-Regular',
  },
  satoshiMedium: {
    fontFamily: 'Satoshi-medium',
  },
  satoshiBold: {
    fontFamily: 'Satoshi-bold',
  },
  main: {
    flex: 1,
    gap: 50,
    justifyContent: 'center',
    maxWidth: 960,
    marginHorizontal: 'auto',
  },
  title: {
    fontSize: 64,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 36,
    color: '#38434D',
    textAlign: 'center',
    marginBottom: 20,
  },
  userInfo: {
    fontSize: 20,
    color: '#007095',
    textAlign: 'center',
  },
});

import {
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Image,
  StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useStationStore } from '@/store/useStationStore';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { StationCardTransformed } from '@/types/stationCardTransformed';
import ArrowLeft from '@/assets/icon/arrow-left.svg';
import Location from '@/assets/icon/location.svg';
import { FuelType } from '@/types/crowdFuelResponse';
import { OrderFuelModal } from '@/components/OrderFuelModal';
import { useOrderStore } from '@/store/orderStore';

const FUEL_TYPES = Object.values(FuelType) as FuelType[];

const capitaliseFuelType = (value: FuelType) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export default function StationPage() {
  const params = useLocalSearchParams<{ stationId?: string | string[] }>();
  const stationIdParam = params.stationId;
  const stationId = Array.isArray(stationIdParam)
    ? stationIdParam[0]
    : stationIdParam;
  const { stations } = useStationStore();
  const [station, setStation] = useState<StationCardTransformed | null>(null);
  const [orderModalVisible, setOrderModalVisible] = useState(false);
  const setOrder = useOrderStore((state) => state.setOrder);

  useEffect(() => {
    if (!stationId) {
      setStation(null);
      return;
    }
    const foundStations = stations.find((s) => s.id === stationId);
    setStation(foundStations ?? null);
  }, [stationId, stations]);

  const productOptions = useMemo(
    () =>
      FUEL_TYPES.map((fuelType) => {
        if (!station) {
          return {
            fuelType,
            price: undefined,
            available: false,
          } as const;
        }
        const price = station.prices[fuelType];
        const hasPrice = price != null;
        const available = hasPrice ? station.availability[fuelType] === true : false;
        return {
          fuelType,
          price,
          available,
        };
      }),
    [station]
  );

  const handleConfirmOrder = useCallback(
    ({ fuelType, quantity }: { fuelType: FuelType; quantity: number }) => {
      if (!station) {
        return;
      }
      const pricePerLiter = station.prices[fuelType];
      if (pricePerLiter == null) {
        return;
      }

      const stationAddress = `${station.city}, ${station.state}`;

      setOrder({
        stationId: station.id,
        stationName: station.stationName,
        stationAddress,
        fuelType,
        quantity,
        pricePerLiter,
        totalPrice: pricePerLiter * quantity,
      });
      setOrderModalVisible(false);
      router.push('/orders');
    },
    [setOrder, station]
  );

  if (!station) {
    return (
      <SafeAreaView className="flex-1 bg-white">
        <View className="flex-1 items-center justify-center">
          <Text>No station selected</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="relative flex-1 bg-white pb-[20px]">
        <Image
          source={station.image}
          className="mb-[16px] h-[234px] w-full rounded-lg"
        />

        <TouchableOpacity
          className="absolute left-[20px] top-[48px] flex h-[32px] w-[32px] items-center justify-center rounded-full bg-white p-[4px] opacity-25"
          onPress={() => router.back()}
        >
          <ArrowLeft width={24} height={24} />
        </TouchableOpacity>

        {/* ------ station details ------ */}
        <View className="flex-1 px-[24px]">
          {/* ------ station name ------ */}
          <Text
            style={[styles.satoshiBold]}
            className="mb-[8px] text-[16px] leading-[180%]"
          >
            {station.stationName}
          </Text>
          {/* ------ station location ------ */}
          <Text className="flex items-center justify-center text-darkgreyNormal">
            <Location width={16} height={16} /> {station.city}, {station.state}
          </Text>

          {/* Products and Prices */}
          <View className="mt-[24px] rounded-2xl bg-[#F4F8F9] p-[16px]">
            <View className="flex-row justify-between border-b border-[#E3E6EA] pb-[12px]">
              <Text className="flex-1 text-xs font-medium uppercase text-[#6C7280]">
                Fuel Type
              </Text>
              <Text className="flex-1 text-center text-xs font-medium uppercase text-[#6C7280]">
                Price/Litre
              </Text>
              <Text className="flex-1 text-right text-xs font-medium uppercase text-[#6C7280]">
                Availability
              </Text>
            </View>

            {FUEL_TYPES.map((fuelType) => {
              const price = station.prices[fuelType];
              const hasPrice = price != null;
              const isAvailable = hasPrice
                ? station.availability[fuelType] === true
                : false;
              const availabilityLabel = isAvailable
                ? 'In-stock'
                : 'Out of stock';
              const availabilityClass = isAvailable
                ? 'text-successDark'
                : 'text-errorNormal';

              return (
                <View
                  key={fuelType}
                  className="flex-row items-center justify-between border-b border-[#E3E6EA] py-[16px] last:border-b-0"
                >
                  <Text className="flex-1 text-base font-medium text-[#1A201D]">
                    {capitaliseFuelType(fuelType)}
                  </Text>
                  <Text className="flex-1 text-center text-sm text-[#1A201D]">
                    {hasPrice ? `₦${price}/L` : 'Price not available'}
                  </Text>
                  <Text
                    className={`flex-1 text-right text-sm font-medium ${availabilityClass}`}
                  >
                    {availabilityLabel}
                  </Text>
                </View>
              );
            })}
          </View>

          <TouchableOpacity
            onPress={() => {
              // Navigate or open modal
              setOrderModalVisible(true);
            }}
            className="mt-[24px] rounded-md bg-[#0095C7] py-[12px]"
          >
            <Text className="text-center text-lg font-semibold text-white">
              Order Fuel
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
      <OrderFuelModal
        visible={orderModalVisible}
        products={productOptions}
        onClose={() => setOrderModalVisible(false)}
        onConfirm={handleConfirmOrder}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  satoshi: {
    fontFamily: 'Satoshi-Regular',
  },
  satoshiMedium: {
    fontFamily: 'Satoshi-medium',
  },
  satoshiBold: {
    fontFamily: 'Satoshi-bold',
  },
});

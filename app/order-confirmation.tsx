import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text, View, TouchableOpacity } from 'react-native';

export default function OrderConfirmationScreen() {
  const params = useLocalSearchParams<{
    stationName?: string;
    fuelType?: string;
    quantity?: string;
  }>();

  const stationName = params.stationName ?? 'Selected Station';
  const fuelType = params.fuelType ?? 'Fuel type unavailable';
  const quantity = params.quantity ?? '0';

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F9]">
      <Stack.Screen options={{ headerShown: false }} />
      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-8 rounded-full bg-[#DCF7E3] px-6 py-3">
          <Text className="text-lg font-semibold text-[#1A7F3C]">
            Order Successful!
          </Text>
        </View>

        <Text className="mb-2 text-2xl font-bold text-[#1A201D]">
          Thank you for your order
        </Text>
        <Text className="mb-8 text-center text-[#6C7280]">
          Your fuel delivery is on its way. Here is a quick summary.
        </Text>

        <View className="mb-10 w-full rounded-2xl bg-white p-6 shadow-sm">
          <View className="mb-4">
            <Text className="text-xs uppercase text-[#6C7280]">
              Station
            </Text>
            <Text className="text-base font-semibold text-[#1A201D]">
              {stationName}
            </Text>
          </View>

          <View className="mb-4">
            <Text className="text-xs uppercase text-[#6C7280]">Fuel</Text>
            <Text className="text-base font-semibold capitalize text-[#1A201D]">
              {fuelType}
            </Text>
          </View>

          <View>
            <Text className="text-xs uppercase text-[#6C7280]">Quantity</Text>
            <Text className="text-base font-semibold text-[#1A201D]">
              {quantity}L
            </Text>
          </View>
        </View>

        <TouchableOpacity
          className="w-full rounded-2xl bg-[#0095C7] py-4"
          onPress={() => router.push('/(tabs)/orders')}
        >
          <Text className="text-center text-base font-semibold text-white">
            Go to My Orders
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

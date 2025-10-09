import { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import { Accordion } from '@/components/Accordion';
import { useLocationStore } from '@/store/locationStore';
import { useOrderStore } from '@/store/orderStore';
import { FuelType } from '@/types/crowdFuelResponse';

const DELIVERY_FEE = 1000;
const SERVICE_FEE = 1000;

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const capitaliseFuelType = (value: FuelType) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export default function OrdersScreen() {
  const { address } = useLocationStore();
  const { order } = useOrderStore();

  const summary = useMemo(() => {
    if (!order) return null;
    const subTotal = order.quantity * order.pricePerLiter;
    const total = subTotal + DELIVERY_FEE + SERVICE_FEE;
    return {
      subTotal,
      total,
    };
  }, [order]);

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F9]">
      <ScrollView contentContainerStyle={{ padding: 24 }}>
        <TouchableOpacity
          className="mb-6 flex-row items-center"
          onPress={() => router.back()}
        >
          <Text className="mr-2 text-xl text-[#1A201D]">‹</Text>
          <Text className="text-xl font-semibold text-[#1A201D]">
            Order Summary
          </Text>
        </TouchableOpacity>

        <Text className="mb-6 text-sm text-[#6C7280]">
          Please confirm the details below before placing your order
        </Text>

        <View className="mb-4">
          <Accordion title="Delivery Details">
            <View className="gap-2">
              <Text className="text-base text-[#1A201D]">
                {address || 'No delivery address selected'}
              </Text>
              <Text className="text-xs text-[#6C7280]">Delivery Address</Text>
              <TouchableOpacity onPress={() => router.push('/address')}>
                <Text className="text-sm font-semibold text-[#0095C7]">
                  Change Address
                </Text>
              </TouchableOpacity>
            </View>
          </Accordion>
        </View>

        <View className="mb-4">
          <Accordion title="Order Details">
            {order ? (
              <View className="gap-4">
                <View>
                  <Text className="text-base font-semibold text-[#1A201D]">
                    {order.stationName}
                  </Text>
                  <Text className="mt-1 text-xs text-[#6C7280]">Station Name</Text>
                </View>
                <View>
                  <Text className="text-sm text-[#1A201D]">
                    {order.stationAddress ?? 'Station address unavailable'}
                  </Text>
                  <Text className="mt-1 text-xs text-[#6C7280]">Station Address</Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-[#6C7280]">Fuel Type</Text>
                  <Text className="text-sm font-medium text-[#1A201D]">
                    {capitaliseFuelType(order.fuelType as FuelType)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-[#6C7280]">Fuel Quantity</Text>
                  <Text className="text-sm font-medium text-[#1A201D]">
                    {order.quantity}L
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-[#6C7280]">Price per Litre</Text>
                  <Text className="text-sm font-medium text-[#1A201D]">
                    {formatCurrency(order.pricePerLiter)}/L
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() =>
                    router.push({
                      pathname: '/station/[stationId]',
                      params: { stationId: order.stationId },
                    })
                  }
                >
                  <Text className="text-sm font-semibold text-[#0095C7]">
                    Edit Order
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <Text className="text-sm text-[#6C7280]">
                No order selected yet.
              </Text>
            )}
          </Accordion>
        </View>

        <View className="mb-10">
          <Accordion title="Payment Details">
            {summary ? (
              <View className="gap-3">
                <View className="flex-row justify-between">
                  <Text className="text-sm text-[#6C7280]">Sub Total</Text>
                  <Text className="text-sm font-medium text-[#1A201D]">
                    {formatCurrency(summary.subTotal)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-[#6C7280]">Delivery Fee</Text>
                  <Text className="text-sm font-medium text-[#1A201D]">
                    {formatCurrency(DELIVERY_FEE)}
                  </Text>
                </View>
                <View className="flex-row justify-between">
                  <Text className="text-sm text-[#6C7280]">Service Fee</Text>
                  <Text className="text-sm font-medium text-[#1A201D]">
                    {formatCurrency(SERVICE_FEE)}
                  </Text>
                </View>
                <View className="flex-row justify-between border-t border-[#E1E4EB] pt-3">
                  <Text className="text-sm font-semibold text-[#1A201D]">Total</Text>
                  <Text className="text-sm font-semibold text-[#1A201D]">
                    {formatCurrency(summary.total)}
                  </Text>
                </View>
              </View>
            ) : (
              <Text className="text-sm text-[#6C7280]">
                No payment details to show.
              </Text>
            )}
          </Accordion>
        </View>
      </ScrollView>

      <View className="border-t border-[#E1E4EB] bg-white px-6 pb-8 pt-4">
        <TouchableOpacity className="rounded-2xl bg-[#0095C7] py-4">
          <Text className="text-center text-base font-semibold text-white">
            Confirm Order
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

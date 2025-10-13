import { useEffect, useMemo, useState } from 'react';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { useAuth } from '@/context/auth-context';
import { authorizedFetch } from '@/utils/authorizedFetch';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

type OrderDetailItem = {
  product?: string;
  quantity_litres?: string | number;
  unit_price?: string | number;
  line_total?: string | number;
};

type OrderDetail = {
  order_id?: number;
  delivery_address?: string;
  status?: string;
  created_at?: string;
  updated_at?: string;
  stationName?: string;
  station_name?: string;
  stationAddress?: string;
  station_address?: string;
  items?: OrderDetailItem[];
};

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const normaliseStatus = (status?: string) =>
  status ? status.replace(/_/g, ' ') : 'unknown';

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

export default function OrderDetailScreen() {
  const params = useLocalSearchParams<{ orderId?: string }>();
  const orderId = params.orderId;
  const { token } = useAuth();

  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [cancelling, setCancelling] = useState(false);

  const fetchOrder = async () => {
    if (!API_BASE_URL) {
      setError('API base URL is not configured.');
      setLoading(false);
      return;
    }

    if (!token) {
      setError('Please log in to view this order.');
      setLoading(false);
      return;
    }

    if (!orderId) {
      setError('No order selected.');
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const data = await authorizedFetch<OrderDetail>(
        token,
        `${API_BASE_URL}/orders/${orderId}`
      );

      if (data) {
        setOrder(data);
      } else {
        setOrder(null);
      }
    } catch (err: any) {
      setError(err?.message ?? 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrder();
  }, [orderId, token]);

  const firstItem = order?.items?.[0];
  const stationName =
    order?.stationName || order?.station_name || 'Fuel Station';
  const stationAddress =
    order?.delivery_address ||
    order?.stationAddress ||
    order?.station_address ||
    'Address unavailable';
  const fuelType = firstItem?.product || 'Fuel';
  const quantityLitres = Number(firstItem?.quantity_litres ?? 0);
  const unitPrice = Number(firstItem?.unit_price ?? 0);
  const lineTotal = Number(firstItem?.line_total ?? quantityLitres * unitPrice);
  const statusLabel = normaliseStatus(order?.status);

  const totalAmount = useMemo(() => {
    if (!order?.items?.length) return 0;
    return order.items.reduce((acc, item) => {
      const value = Number(item.line_total ?? 0);
      return acc + (Number.isFinite(value) ? value : 0);
    }, 0);
  }, [order?.items]);

  const formattedQuantity = Number.isFinite(quantityLitres)
    ? `${quantityLitres.toLocaleString()}L`
    : '—';
  const formattedUnitPrice = Number.isFinite(unitPrice)
    ? formatCurrency(unitPrice)
    : '—';
  const formattedLineTotal = Number.isFinite(lineTotal)
    ? formatCurrency(lineTotal)
    : '—';

  const createdAt = order?.created_at
    ? new Date(order.created_at).toLocaleString()
    : 'Unknown';

  const cancellable =
    (order?.status ?? '').toLowerCase() === 'pending' && !cancelling;

  const handleCancelOrder = async () => {
    if (!API_BASE_URL || !orderId || !token) {
      Alert.alert(
        'Unable to cancel',
        'Missing configuration or authentication details.'
      );
      return;
    }

    Alert.alert(
      'Cancel order?',
      'Are you sure you want to cancel this order?',
      [
        { text: 'No' },
        {
          text: 'Yes, cancel',
          style: 'destructive',
          onPress: async () => {
            try {
              setCancelling(true);
              await authorizedFetch(
                token,
                `${API_BASE_URL}/orders/${orderId}`,
                { method: 'DELETE' }
              );
              setOrder((prev) =>
                prev ? { ...prev, status: 'cancelled' } : prev
              );
              Alert.alert('Order cancelled', 'The order has been cancelled.');
            } catch (err: any) {
              Alert.alert(
                'Unable to cancel',
                err?.message ?? 'Something went wrong. Please try again.'
              );
            } finally {
              setCancelling(false);
            }
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F9]">
      <Stack.Screen options={{ headerShown: false }} />
      <ScrollView contentContainerStyle={{ padding: 24, paddingBottom: 48 }}>
        <TouchableOpacity
          className="mb-6 flex-row items-center"
          onPress={() => router.back()}
        >
          <Text className="mr-2 text-xl text-[#1A201D]">‹</Text>
          <Text className="text-xl font-semibold text-[#1A201D]">
            Order Details
          </Text>
        </TouchableOpacity>

        {loading ? (
          <View className="mt-20 items-center">
            <ActivityIndicator size="small" color="#0095C7" />
            <Text className="mt-3 text-sm text-[#6C7280]">
              Fetching order details...
            </Text>
          </View>
        ) : error ? (
          <View className="rounded-2xl border border-[#FFCDD2] bg-[#FFF2F4] p-4">
            <Text className="text-sm font-medium text-[#B00020]">{error}</Text>
            <TouchableOpacity
              className="mt-3 rounded-lg bg-[#0095C7] px-4 py-2"
              onPress={fetchOrder}
            >
              <Text className="text-center text-sm font-semibold text-white">
                Retry
              </Text>
            </TouchableOpacity>
          </View>
        ) : !order ? (
          <View className="items-center">
            <Text className="text-sm text-[#6C7280]">
              Order information is unavailable.
            </Text>
          </View>
        ) : (
          <>
            <View className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <View className="mb-4 flex-row justify-between">
                <View>
                  <Text className="text-base font-semibold text-[#1A201D]">
                    {stationName}
                  </Text>
                  <Text className="text-xs text-[#6C7280]">{createdAt}</Text>
                </View>
                <View className="rounded-full bg-[#DCF7E3] px-3 py-1">
                  <Text className="text-xs font-medium capitalize text-[#1A7F3C]">
                    {statusLabel}
                  </Text>
                </View>
              </View>

              <View>
                <Text className="text-xs uppercase text-[#6C7280]">
                  Delivery Address
                </Text>
                <Text className="text-sm font-semibold text-[#1A201D]">
                  {stationAddress}
                </Text>
              </View>
            </View>

            <View className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <Text className="mb-4 text-base font-semibold text-[#1A201D]">
                Order Items
              </Text>

              {order.items?.map((item, index) => {
                const quantity = Number(item.quantity_litres ?? 0);
                const unitPriceValue = Number(item.unit_price ?? 0);
                const lineTotalValue = Number(
                  item.line_total ?? quantity * unitPriceValue
                );

                return (
                  <View
                    key={`${item.product}-${index}`}
                    className={`rounded-xl border border-[#E1E4EB] p-4 ${
                      index > 0 ? 'mt-3' : ''
                    }`}
                  >
                    <Text className="text-sm font-semibold capitalize text-[#1A201D]">
                      {item.product ?? 'Fuel'}
                    </Text>
                    <View className="mt-3 flex-row justify-between">
                      <View>
                        <Text className="text-xs uppercase text-[#6C7280]">
                          Quantity
                        </Text>
                        <Text className="text-sm font-medium text-[#1A201D]">
                          {Number.isFinite(quantity)
                            ? `${quantity.toLocaleString()}L`
                            : '—'}
                        </Text>
                      </View>
                      <View className="items-end">
                        <Text className="text-xs uppercase text-[#6C7280]">
                          Unit Price
                        </Text>
                        <Text className="text-sm font-medium text-[#1A201D]">
                          {Number.isFinite(unitPriceValue)
                            ? formatCurrency(unitPriceValue)
                            : '—'}
                        </Text>
                      </View>
                    </View>
                    <View className="mt-3 flex-row justify-between border-t border-[#E1E4EB] pt-3">
                      <Text className="text-xs uppercase text-[#6C7280]">
                        Line Total
                      </Text>
                      <Text className="text-sm font-semibold text-[#1A201D]">
                        {Number.isFinite(lineTotalValue)
                          ? formatCurrency(lineTotalValue)
                          : '—'}
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>

            <View className="mb-6 rounded-2xl bg-white p-6 shadow-sm">
              <Text className="mb-3 text-base font-semibold text-[#1A201D]">
                Payment Summary
              </Text>
              <View className="flex-row justify-between">
                <Text className="text-sm text-[#6C7280]">Items Total</Text>
                <Text className="text-sm font-medium text-[#1A201D]">
                  {formatCurrency(totalAmount)}
                </Text>
              </View>
            </View>

            {cancellable ? (
              <TouchableOpacity
                className="rounded-2xl bg-[#FF7043] py-4"
                onPress={handleCancelOrder}
                disabled={cancelling}
              >
                <Text className="text-center text-base font-semibold text-white">
                  {cancelling ? 'Cancelling...' : 'Cancel Order'}
                </Text>
              </TouchableOpacity>
            ) : null}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

import { useEffect, useMemo, useRef, useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Alert,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { router } from 'expo-router';
import { Accordion } from '@/components/Accordion';
import { useLocationStore } from '@/store/locationStore';
import { OrderDetails, useOrderStore } from '@/store/orderStore';
import { FuelType } from '@/types/crowdFuelResponse';
import { useAuth } from '@/context/auth-context';
import { authorizedFetch } from '@/utils/authorizedFetch';

const DELIVERY_FEE = 1000;
const SERVICE_FEE = 1000;
const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL;

const formatCurrency = (value: number) => `₦${value.toLocaleString()}`;

const capitaliseFuelType = (value: FuelType) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

type ApiOrderItem = {
  product?: string;
  quantity_litres?: string | number;
  unit_price?: string | number;
  line_total?: string | number;
  stationName?: string;
  stationAddress?: string;
};

type ApiOrder = {
  order_id?: number;
  delivery_address?: string;
  status?: string;
  created_at?: string;
  stationName?: string;
  station_name?: string;
  stationAddress?: string;
  station_address?: string;
  items?: ApiOrderItem[];
};

const isNumber = (value: unknown): value is number =>
  typeof value === 'number' && Number.isFinite(value);

const normaliseStatus = (status?: string) =>
  status ? status.replace(/_/g, ' ') : 'unknown';

export default function OrdersScreen() {
  const { address } = useLocationStore();
  const { order, clearOrder, updateOrder } = useOrderStore();
  const { token } = useAuth();

  const [placingOrder, setPlacingOrder] = useState(false);
  const [activeTab, setActiveTab] = useState<'cart' | 'ongoing' | 'completed'>(
    'cart'
  );

  const [orders, setOrders] = useState<ApiOrder[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState<string | null>(null);
  const hasFetchedOrders = useRef(false);

  const fetchOrders = async () => {
    if (!API_BASE_URL) {
      setOrdersError('API base URL is not configured.');
      return;
    }

    if (!token) {
      setOrdersError('Please log in to view your orders.');
      return;
    }

    try {
      setOrdersLoading(true);
      setOrdersError(null);

      const data = await authorizedFetch<ApiOrder[] | { orders: ApiOrder[] }>(
        token,
        `${API_BASE_URL}/orders`
      );

      if (Array.isArray(data)) {
        setOrders(data);
      } else if (Array.isArray(data?.orders)) {
        setOrders(data.orders);
      } else {
        setOrders([]);
      }

      hasFetchedOrders.current = true;
    } catch (error: any) {
      setOrdersError(error?.message ?? 'Something went wrong.');
    } finally {
      setOrdersLoading(false);
    }
  };

  useEffect(() => {
    if (
      activeTab !== 'cart' &&
      token &&
      API_BASE_URL &&
      !hasFetchedOrders.current
    ) {
      fetchOrders();
    }
  }, [activeTab, token]);

  const hasConfirmedOrder = useMemo(() => {
    if (!order) return false;
    const hasQuantity = isNumber(order.quantity);
    const hasFuelType = Boolean(order.fuelType);
    const hasPricing = isNumber(order.pricePerLiter);
    const hasStation = Boolean(order.stationId);
    return hasQuantity && hasFuelType && hasPricing && hasStation;
  }, [order]);

  const cartSummary = useMemo(() => {
    if (!hasConfirmedOrder || !order) return null;
    const subTotal = order.quantity * order.pricePerLiter;
    const total = subTotal + DELIVERY_FEE + SERVICE_FEE;
    return {
      subTotal,
      total,
    };
  }, [order, hasConfirmedOrder]);

  useEffect(() => {
    if (!order) return;
    const updates: Partial<OrderDetails> = {};

    if (address && order.deliveryAddress !== address) {
      updates.deliveryAddress = address;
    }

    const recalculatedTotal = order.quantity * order.pricePerLiter;
    if (
      Number.isFinite(recalculatedTotal) &&
      order.totalAmount !== recalculatedTotal
    ) {
      updates.totalAmount = recalculatedTotal;
    }

    if (Object.keys(updates).length > 0) {
      updateOrder(updates);
    }
  }, [order, address, updateOrder]);

  const ongoingOrders = useMemo(() => {
    const activeStatuses = ['pending', 'confirmed', 'in_transit'];
    return orders.filter((record) =>
      activeStatuses.includes((record.status ?? '').toLowerCase())
    );
  }, [orders]);

  const completedOrders = useMemo(() => {
    const doneStatuses = ['delivered', 'cancelled'];
    return orders.filter((record) =>
      doneStatuses.includes((record.status ?? '').toLowerCase())
    );
  }, [orders]);

  const handlePlaceOrder = async () => {
    if (!order || !hasConfirmedOrder) {
      Alert.alert(
        'No order to place',
        'Please select a fuel type and quantity, then confirm your order before proceeding.'
      );
      return;
    }

    if (!token) {
      Alert.alert('Sign in required', 'Please log in to place an order.');
      router.push('/(auth)/login');
      return;
    }

    if (!address) {
      Alert.alert(
        'Delivery address missing',
        'Please select a delivery address before placing your order.'
      );
      router.push('/address');
      return;
    }

    if (!API_BASE_URL) {
      Alert.alert(
        'Configuration error',
        'API base URL is not configured. Please try again later.'
      );
      return;
    }

    try {
      setPlacingOrder(true);
      await authorizedFetch(
        token,
        `${API_BASE_URL}/orders`,
        {
          method: 'POST',
          body: JSON.stringify({
            station_name: order.stationName,
            delivery_address: order.deliveryAddress ?? address,
            status: 'pending',
            items: [
              {
                product: order.fuelType,
                quantity_litres: Number(order.quantity),
                unit_price: Number(order.pricePerLiter),
                station_name: order.stationName,
              },
            ],
          }),
        }
      );

      clearOrder();
      Alert.alert(
        'Order placed',
        'Your order has been submitted successfully.'
      );
      setActiveTab('ongoing');
      hasFetchedOrders.current = false;
      fetchOrders();
    } catch (error: any) {
      Alert.alert(
        'Unable to place order',
        error?.message ?? 'Something went wrong. Please try again.'
      );
    } finally {
      setPlacingOrder(false);
    }
  };

  const renderOrdersError = (retry: () => void) => (
    <View className="mt-10 rounded-2xl border border-[#FFCDD2] bg-[#FFF2F4] p-4">
      <Text className="text-sm font-medium text-[#B00020]">
        {ordersError}
      </Text>
      <TouchableOpacity
        className="mt-3 rounded-lg bg-[#0095C7] px-4 py-2"
        onPress={retry}
      >
        <Text className="text-center text-sm font-semibold text-white">
          Retry
        </Text>
      </TouchableOpacity>
    </View>
  );

  const renderOrdersLoading = (message: string) => (
    <View className="mt-10 items-center">
      <ActivityIndicator size="small" color="#0095C7" />
      <Text className="mt-3 text-sm text-[#6C7280]">{message}</Text>
    </View>
  );

  const renderEmptyState = (
    title: string,
    description: string,
    cta?: { label: string; onPress: () => void }
  ) => (
    <View className="mt-14 items-center px-6">
      <Text className="text-center text-lg font-semibold text-[#1A201D]">
        {title}
      </Text>
      <Text className="mt-2 text-center text-sm text-[#6C7280]">
        {description}
      </Text>
      {cta ? (
        <TouchableOpacity
          className="mt-6 rounded-2xl bg-[#0095C7] px-6 py-3"
          onPress={cta.onPress}
        >
          <Text className="text-center text-base font-semibold text-white">
            {cta.label}
          </Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderMyCart = () => (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
    >
      {hasConfirmedOrder && order ? (
        <>
          <TouchableOpacity
            className="mb-6 mt-6 flex-row items-center"
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
            </Accordion>
          </View>

          <View className="mb-10">
            <Accordion title="Payment Details">
              {cartSummary ? (
                <View className="gap-3">
                  <View className="flex-row justify-between">
                    <Text className="text-sm text-[#6C7280]">Sub Total</Text>
                    <Text className="text-sm font-medium text-[#1A201D]">
                      {formatCurrency(cartSummary.subTotal)}
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
                    <Text className="text-sm font-semibold text-[#1A201D]">
                      Total
                    </Text>
                    <Text className="text-sm font-semibold text-[#1A201D]">
                      {formatCurrency(cartSummary.total)}
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
        </>
      ) : (
        renderEmptyState(
          'No items in cart',
          'Select a station, choose a fuel type and quantity, then confirm to review your cart.',
          {
            label: 'Browse Stations',
            onPress: () => router.push('/(tabs)/index'),
          }
        )
      )}
    </ScrollView>
  );

  const renderOrderCard = (
    item: ApiOrder,
    options?: { showDetailsCta?: boolean }
  ) => {
    const firstItem = item.items?.[0];
    const stationName =
      item.stationName ||
      item.station_name ||
      firstItem?.stationName ||
      'Fuel Station';
    const stationAddress =
      item.delivery_address ||
      item.stationAddress ||
      item.station_address ||
      'Address unavailable';
    const fuelType = firstItem?.product ?? 'Fuel';
    const quantityValue = Number(firstItem?.quantity_litres ?? 0);
    const formattedQuantity = Number.isFinite(quantityValue)
      ? `${quantityValue.toLocaleString()}L`
      : '—';
    const unitPriceValue = Number(firstItem?.unit_price ?? 0);
    const formattedUnitPrice = Number.isFinite(unitPriceValue)
      ? formatCurrency(unitPriceValue)
      : '—';
    const status = normaliseStatus(item.status);
    const orderDate = item.created_at
      ? new Date(item.created_at).toLocaleDateString(undefined, {
          day: 'numeric',
          month: 'short',
          year: 'numeric',
        })
      : 'Date unavailable';

    return (
      <View
        key={`${item.order_id}-${item.created_at}`}
        className="mb-4 rounded-2xl bg-white p-6 shadow-sm"
      >
        <View className="mb-3 flex-row justify-between">
          <View>
            <Text className="text-base font-semibold text-[#1A201D]">
              {stationName}
            </Text>
            <Text className="text-xs text-[#6C7280]">{orderDate}</Text>
          </View>
          <View className="rounded-full bg-[#DCF7E3] px-3 py-1">
            <Text className="text-xs font-medium capitalize text-[#1A7F3C]">
              {status}
            </Text>
          </View>
        </View>

        <View className="mb-3">
          <Text className="text-xs uppercase text-[#6C7280]">Delivery</Text>
          <Text className="text-sm font-semibold text-[#1A201D]">
            {stationAddress}
          </Text>
        </View>

        <View className="flex-row justify-between border-t border-[#E1E4EB] pt-3">
          <View>
            <Text className="text-xs uppercase text-[#6C7280]">Fuel</Text>
            <Text className="text-sm font-semibold capitalize text-[#1A201D]">
              {fuelType}
            </Text>
          </View>
          <View className="items-end">
            <Text className="text-xs uppercase text-[#6C7280]">Quantity</Text>
            <Text className="text-sm font-semibold text-[#1A201D]">
              {formattedQuantity}
            </Text>
          </View>
        </View>

        <View className="mt-3 flex-row justify-between">
          <View>
            <Text className="text-xs uppercase text-[#6C7280]">Unit Price</Text>
            <Text className="text-sm font-semibold text-[#1A201D]">
              {formattedUnitPrice}
            </Text>
          </View>
          {options?.showDetailsCta ? (
            <TouchableOpacity
              className="rounded-full bg-[#0095C7] px-4 py-2"
              onPress={() =>
                router.push({
                  pathname: '/order/[orderId]',
                  params: { orderId: String(item.order_id ?? '') },
                })
              }
            >
              <Text className="text-sm font-semibold text-white">
                View Details
              </Text>
            </TouchableOpacity>
          ) : null}
        </View>
      </View>
    );
  };

  const renderOngoing = () => (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
    >
      <Text className="mb-6 mt-6 text-sm text-[#6C7280]">
        Track orders that are on the way or awaiting confirmation.
      </Text>

      {ordersLoading
        ? renderOrdersLoading('Fetching your ongoing orders...')
        : ordersError
          ? renderOrdersError(() => {
              hasFetchedOrders.current = false;
              fetchOrders();
            })
          : ongoingOrders.length === 0
            ? renderEmptyState(
                'No ongoing orders',
                'When you place a new order, it will appear here while it is being processed.'
              )
            : ongoingOrders.map((record) =>
                renderOrderCard(record, { showDetailsCta: true })
              )}
    </ScrollView>
  );

  const renderCompleted = () => (
    <ScrollView
      contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24 }}
    >
      <Text className="mb-6 mt-6 text-sm text-[#6C7280]">
        Review your previously fulfilled or cancelled orders.
      </Text>

      {ordersLoading
        ? renderOrdersLoading('Fetching your completed orders...')
        : ordersError
          ? renderOrdersError(() => {
              hasFetchedOrders.current = false;
              fetchOrders();
            })
          : completedOrders.length === 0
            ? renderEmptyState(
                'No completed orders',
                'Once an order is delivered or cancelled, it will appear here.'
              )
            : completedOrders.map((record) => renderOrderCard(record))}
    </ScrollView>
  );

  return (
    <SafeAreaView className="flex-1 bg-[#F4F8F9]">
      <View className="flex-1">
        <View className="px-6 pt-6">
          <Text className="text-2xl font-semibold text-[#1A201D]">Orders</Text>
        </View>

        <View className="mx-6 mt-6 flex-row rounded-full bg-[#E1E4EB] p-1">
          {[
            { key: 'cart' as const, label: 'My Cart' },
            { key: 'ongoing' as const, label: 'Ongoing' },
            { key: 'completed' as const, label: 'Completed' },
          ].map(({ key, label }) => {
            const isActive = activeTab === key;
            return (
              <TouchableOpacity
                key={key}
                className={`flex-1 rounded-full py-2 ${
                  isActive ? 'bg-white' : ''
                }`}
                onPress={() => setActiveTab(key)}
              >
                <Text
                  className={`text-center text-sm font-semibold ${
                    isActive ? 'text-[#0095C7]' : 'text-[#6C7280]'
                  }`}
                >
                  {label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        {activeTab === 'cart'
          ? renderMyCart()
          : activeTab === 'ongoing'
            ? renderOngoing()
            : renderCompleted()}

        {activeTab === 'cart' && hasConfirmedOrder ? (
          <View className="border-t border-[#E1E4EB] bg-white px-6 pb-8 pt-4">
            <TouchableOpacity
              className={`rounded-2xl bg-[#0095C7] py-4 ${
                placingOrder ? 'opacity-60' : ''
              }`}
              onPress={handlePlaceOrder}
              disabled={placingOrder}
            >
              <Text className="text-center text-base font-semibold text-white">
                {placingOrder ? 'Placing Order...' : 'Place Order'}
              </Text>
            </TouchableOpacity>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}

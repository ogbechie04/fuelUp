import React, { useEffect, useMemo, useState } from 'react';
import {
  Modal,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from 'react-native';
import { FuelType } from '@/types/crowdFuelResponse';

interface OrderProductOption {
  fuelType: FuelType;
  price?: number;
  available: boolean;
}

interface OrderFuelModalProps {
  visible: boolean;
  products: OrderProductOption[];
  onClose: () => void;
  onConfirm: (payload: { fuelType: FuelType; quantity: number }) => void;
}

const QUANTITY_PRESETS = [5, 10, 15, 20, 25];
const MIN_QUANTITY = 5;
const MAX_QUANTITY = 25;
const QUANTITY_STEP = 1;

const capitaliseFuelType = (value: FuelType) =>
  value.charAt(0).toUpperCase() + value.slice(1).toLowerCase();

export const OrderFuelModal: React.FC<OrderFuelModalProps> = ({
  visible,
  products,
  onClose,
  onConfirm,
}) => {
  const firstAvailable = useMemo(
    () => products.find((product) => product.available),
    [products]
  );

  const [selectedFuelType, setSelectedFuelType] = useState<FuelType | null>(
    firstAvailable?.fuelType ?? null
  );
  const [quantity, setQuantity] = useState<number>(25);

  useEffect(() => {
    if (visible) {
      setSelectedFuelType(firstAvailable?.fuelType ?? null);
      setQuantity(25);
    } else {
      setSelectedFuelType(null);
      setQuantity(25);
    }
  }, [visible, firstAvailable]);

  const clampQuantity = (value: number) =>
    Math.max(MIN_QUANTITY, Math.min(MAX_QUANTITY, value));

  const changeQuantity = (value: number) => {
    setQuantity(clampQuantity(value));
  };

  const adjustQuantity = (direction: 'increase' | 'decrease') => {
    setQuantity((prev) => {
      const delta = direction === 'increase' ? QUANTITY_STEP : -QUANTITY_STEP;
      return clampQuantity(prev + delta);
    });
  };

  const confirmDisabled =
    !selectedFuelType ||
    !products
      .find((product) => product.fuelType === selectedFuelType)
      ?.available;

  return (
    <Modal
      animationType="slide"
      transparent
      visible={visible}
      onRequestClose={onClose}
    >
      <View
        className="flex-1 items-center justify-center px-6"
        style={{ backgroundColor: 'rgba(0,0,0,0.4)' }}
      >
        <View className="w-full rounded-3xl bg-white p-6">
          <View className="mb-6 flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-[#1A201D]">Order Fuel</Text>
            <Pressable
              accessibilityRole="button"
              onPress={onClose}
              className="h-8 w-8 items-center justify-center rounded-full bg-[#F2F4F5]"
            >
              <Text className="text-lg text-[#6C7280]">×</Text>
            </Pressable>
          </View>

          <Text className="mb-4 text-center text-sm text-[#6C7280]">
            Pick a product to order
          </Text>

          <View className="gap-3">
            {products.map((product) => {
              const isSelected = selectedFuelType === product.fuelType;
              const isDisabled = !product.available;

              return (
                <TouchableOpacity
                  key={product.fuelType}
                  activeOpacity={0.8}
                  disabled={isDisabled}
                  onPress={() => setSelectedFuelType(product.fuelType)}
                  className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 ${
                    isSelected ? 'border-[#0095C7]' : 'border-[#E1E4EB]'
                  } ${isDisabled ? 'opacity-50' : ''}`}
                >
                  <Text className="text-base font-medium text-[#1A201D]">
                    {capitaliseFuelType(product.fuelType)}
                  </Text>
                  <View
                    className={`h-5 w-5 rounded-full border-2 ${
                      isSelected ? 'border-[#0095C7]' : 'border-[#9AA0AA]'
                    } items-center justify-center`}
                  >
                    {isSelected && <View className="h-2.5 w-2.5 rounded-full bg-[#0095C7]" />}
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>

          {selectedFuelType && (
            <View className="mt-6 rounded-2xl border border-[#0095C7] bg-[#F4F8F9] p-4">
              <Text className="mb-3 text-sm font-medium text-[#1A201D]">
                Quantity
              </Text>
              <View className="mb-4 flex-row items-center justify-between rounded-xl border border-[#0095C7] bg-white px-4 py-3">
                <TouchableOpacity
                  onPress={() => adjustQuantity('decrease')}
                  className="h-8 w-8 items-center justify-center rounded-full border border-[#0095C7]"
                  accessibilityRole="button"
                  accessibilityLabel="Decrease quantity"
                >
                  <Text className="text-lg text-[#0095C7]">−</Text>
                </TouchableOpacity>
                <Text className="text-base font-semibold text-[#1A201D]">
                  {quantity}L
                </Text>
                <TouchableOpacity
                  onPress={() => adjustQuantity('increase')}
                  className="h-8 w-8 items-center justify-center rounded-full border border-[#0095C7]"
                  accessibilityRole="button"
                  accessibilityLabel="Increase quantity"
                >
                  <Text className="text-lg text-[#0095C7]">+</Text>
                </TouchableOpacity>
              </View>

              <View className="flex-row flex-wrap gap-2">
                {QUANTITY_PRESETS.map((preset) => (
                  <TouchableOpacity
                    key={preset}
                    onPress={() => changeQuantity(preset)}
                    className={`rounded-full border px-4 py-2 ${
                      quantity === preset
                        ? 'border-[#0095C7] bg-[#0095C7]'
                        : 'border-[#0095C7]'
                    }`}
                  >
                    <Text
                      className={`text-sm font-medium ${
                        quantity === preset ? 'text-white' : 'text-[#0095C7]'
                      }`}
                    >
                      {preset}L
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}

          <TouchableOpacity
            disabled={confirmDisabled}
            onPress={() => {
              if (!selectedFuelType) return;
              onConfirm({ fuelType: selectedFuelType, quantity });
            }}
            className={`mt-8 rounded-2xl py-4 ${
              confirmDisabled ? 'bg-[#D1D5DB]' : 'bg-[#0095C7]'
            }`}
          >
            <Text
              className={`text-center text-base font-semibold ${
                confirmDisabled ? 'text-[#9AA0AA]' : 'text-white'
              }`}
            >
              Confirm
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
  ImageSourcePropType,
} from 'react-native';
import mobilImage from '@/assets/images/mobil-station.png';
import GasStation from '@/assets/icon/gas-station.svg';
import Clock from '@/assets/icon/clock.svg';
import Truck from '@/assets/icon/truck.svg';
import Heart from '@/assets/icon/heart.svg';
import Star from '@/assets/icon/star.svg';
import Fontisto from '@expo/vector-icons/Fontisto';

/**
 *
 * @returns
 * TODO: Hide in-stock text
 * TODO: Hide distance, time and rating section
 * favorite controls whether the heart is filled
 * onToggleFavorite lets the parent manage the favourite
 * initialFuelType for the uncontrolled state
 * fuelType and onFuelTypeChange for the controlled state. Lets the parent manage the favourite
 */

type FuelType = 'petrol' | 'diesel';

interface StationCardProps {
  stationName: string;
  image: ImageSourcePropType;
  prices: Partial<Record<FuelType, number>>;
  stockAvailable?: Partial<Record<FuelType, boolean>>;
  distanceKm?: number;
  closesAtLabel?: number;
  rating?: number;
  favorite?: boolean;
  onToggleFavorite?: (next: boolean) => void;
  initialFuelType?: FuelType;
  fuelType?: FuelType;
  onFuelTypeChange?: (next: FuelType) => void;
}

export const StationCard: React.FC<StationCardProps> = ({
  stationName = 'Shell Filling Station',
  image = mobilImage,
  prices,
  stockAvailable,
  distanceKm,
  closesAtLabel,
  rating,
  favorite,
  onToggleFavorite,
  initialFuelType,
  fuelType,
  onFuelTypeChange,
}) => {
  const [internalFuelType, setInternalFuelType] = useState<FuelType>(
    initialFuelType || 'petrol'
  );
  const currentFuelType = fuelType ?? internalFuelType;
  const updateFuelType = onFuelTypeChange ?? setInternalFuelType;
  const [isPetrol, setIsPetrol] = useState(true);
  //   const [stockAvailable, setStockAvailable] = useState(true);

  const toggleFuelType = () => {
    const nextFuel = currentFuelType === 'petrol' ? 'diesel' : 'petrol';
    updateFuelType(nextFuel);
  };

  //   const changeProduct = ({}) => {
  //     setIsPetrol((product) => !product);
  //   };

  //   const changeStockAvailable = () => {
  //     setStockAvailable((stock) => !stock);
  //   };

  useEffect(() => {
    console.log('Fuel type is now:', isPetrol ? 'Petrol' : 'Diesel');
  }, [isPetrol]);
  return (
    <View className="w-fit max-w-[301px]">
      {/* ------ station image ------ */}
      <Image className="mb-2" source={image} />

      {/* ------ station name and toggle product ------ */}
      <View className="mb-2 w-full flex-row items-center justify-between">
        <Text style={[styles.satoshiMedium]} className="">
          {stationName}
        </Text>

        {/* ------ toggle fuel button ------- */}
        <View className="flex-row items-center gap-2">
          <Text
            className="text-[#84868C]"
            style={[styles.satoshiMedium, styles.toggleText]}
          >
            Toggle Product
          </Text>
          <TouchableOpacity onPress={toggleFuelType}>
            <Fontisto
              name={currentFuelType === 'petrol' ? 'toggle-on' : 'toggle-off'}
              size={24}
              color={currentFuelType === 'petrol' ? '#046977' : '#FEE00A'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ------ fuel name, fuel price and availability ------ */}
      <View className="mb-4 flex-row items-center gap-2">
        <GasStation width={16} height={16} color={'#1A201D'} />
        <Text
          className="text-blackNormal"
          style={[styles.satoshiMedium, styles.priceText]}
        >
          {currentFuelType.charAt(0).toUpperCase() +
            currentFuelType.substring(1).toLowerCase()}
          :{' '}
          {prices?.[currentFuelType] != null
            ? `${prices[currentFuelType]}/L`
            : 'Price not available'}
        </Text>
        <Text
          className={` ${stockAvailable?.[currentFuelType] === true ? 'text-successDark' : 'text-errorNormal'}`}
          style={[styles.satoshiMedium, styles.toggleText]}
        >
          {stockAvailable?.[currentFuelType] ? 'In-stock' : 'Out of Stock'}
        </Text>
      </View>

      {/* ------ distance, time and rating ------ */}
      <View className="flex-row items-center justify-between">
        {/* ------ distance and time ------ */}
        <View className="flex-row gap-[5px]">
          <Truck color={'#84868C'} width={12} height={12} />
          <Text
            className="text-darkgreyNormal"
            style={[styles.satoshiMedium, styles.toggleText]}
          >
            {distanceKm ?? '__'}km
          </Text>
          {/* ------ separator ------ */}
          <View className="bg-darkgreyNormal w-[2px]"></View>
          <Clock color={'#84868C'} width={12} height={12} />

          <Text
            className="text-darkgreyNormal"
            style={[styles.satoshiMedium, styles.toggleText]}
          >{`Open till ${closesAtLabel ?? '10PM'}`}</Text>
        </View>

        {/* ------ rating ------ */}
        <View className="flex-row items-center">
          <Star color={'none'} width={12} height={12} fill={'#FEE00A'} />
          <Text
            className="text-darkgreyNormal ml-[4px] mr-[8px]"
            style={[styles.satoshiMedium, styles.toggleText]}
          >
            {rating ?? 'N/A'}
          </Text>
          <TouchableOpacity onPress={() => onToggleFavorite?.(!favorite)}>
            <Heart color={'#84868C'} width={12} height={12} />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

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
  toggleText: {
    fontSize: 10,
    // color: '#84868C',
  },
  priceText: {
    fontSize: 10,
  },
  availabilityText: {},
});

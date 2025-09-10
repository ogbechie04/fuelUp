import { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  TouchableOpacity,
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
 */

export const StationCard = () => {
  const [isPetrol, setIsPetrol] = useState(true);
  const [stockAvailable, setStockAvailable] = useState(true);

  const changeProduct = () => {
    setIsPetrol((product) => !product);
  };

  const changeStockAvailable = () => {
    setStockAvailable((stock) => !stock);
  };

  useEffect(() => {
    console.log('Fuel type is now:', isPetrol ? 'Petrol' : 'Diesel');
  }, [isPetrol]);
  return (
    <View className="w-fit max-w-[301px]">
      {/* ------ station image ------ */}
      <Image className="mb-2" source={mobilImage} />

      {/* ------ station name and toggle product ------ */}
      <View className="mb-2 w-full flex-row items-center justify-between">
        <Text style={[styles.satoshiMedium]} className="">
          Shell Filling Station
        </Text>

        {/* ------ toggle button ------- */}
        <View className="flex-row items-center gap-2">
          <Text
            className="text-[#84868C]"
            style={[styles.satoshiMedium, styles.toggleText]}
          >
            Toggle Product
          </Text>
          <TouchableOpacity onPress={changeProduct}>
            <Fontisto
              name={isPetrol ? 'toggle-on' : 'toggle-off'}
              size={24}
              color={isPetrol ? '#046977' : '#FEE00A'}
            />
          </TouchableOpacity>
        </View>
      </View>

      {/* ------ price and availability ------ */}
      <View className="mb-4 flex-row items-center gap-2">
        <GasStation width={16} height={16} color={'#1A201D'} />
        <Text
          className="text-blackNormal"
          style={[styles.satoshiMedium, styles.priceText]}
        >
          {isPetrol ? 'Petrol' : 'Diesel'}: {`₦900/L`}
        </Text>
        <Text
          className={`rounded-[50px] px-[10px] py-[4px] ${stockAvailable ? 'text-successNormal bg-successLight' : 'text-errorNormal bg-errorLight'}`}
          style={[styles.satoshiMedium, styles.toggleText]}
        >
          {stockAvailable ? 'In stock' : 'Out of stock'}
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
            {`10`}km
          </Text>
          {/* ------ separator ------ */}
          <View className="bg-darkgreyNormal w-[2px]"></View>
          <Clock color={'#84868C'} width={12} height={12} />
          <Text
            className="text-darkgreyNormal"
            style={[styles.satoshiMedium, styles.toggleText]}
          >{`Open till 9PM`}</Text>
        </View>

        {/* ------ rating ------ */}
        <View className="flex-row items-center">
          <Star color={'none'} width={12} height={12} fill={'#FEE00A'} />
          <Text
            className="text-darkgreyNormal ml-[4px] mr-[8px]"
            style={[styles.satoshiMedium, styles.toggleText]}
          >{`4.5`}</Text>
          <TouchableOpacity>
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
    fontSize: 8,
    // color: '#84868C',
  },
  priceText: {
    fontSize: 10,
  },
  availabilityText: {},
});

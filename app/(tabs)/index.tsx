import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/context/auth-context';
import { StationCard } from '@/components/StationCard';
import { fetchCrowdFuelPrices } from '@/api/crowdFuelPrice';
import { useEffect, useState } from 'react';
import { transformCrowdFuelData } from '@/utils/transformCrowdFuelData';
import { StationCardTransformed } from '@/types/stationCardTransformed';
import Location from '@/assets/icon/location.svg';
import ArrowDown from '@/assets/icon/arrow-down.svg';
import { router } from 'expo-router';
import { useLocationStore } from '@/store/locationStore';
import { normalizeLgaName } from '@/utils/normalizeLga';
import { useStationStore } from '@/store/useStationStore';

export default function HomeScreen() {
  const { user, logout } = useAuth();
  const { loadLocation, lga } = useLocationStore();
  const address = useLocationStore((s) => s.address);
  // const [stations, setStations] = useState<StationCardTransformed[]>([]);
  const {stations, setStations} = useStationStore()
  const [filteredStations, setFilteredStations] = useState(stations);

  useEffect(() => {
    loadLocation();
    fetchCrowdFuelPrices()
      .then((raw) => {
        const formatted = transformCrowdFuelData(raw);
        setStations(formatted);
      })
      .catch((err) => {
        console.log('Error fetching stations:', err);
      });
  }, []);

  useEffect(() => {
    if (!lga) {
      setFilteredStations(stations);
      return;
    }
    console.log('Selected LGA:', lga);
    console.log('Normalized LGA:', normalizeLgaName(lga));
    console.log(
      'Normalized Station LGAs:',
      stations.map((s) => normalizeLgaName(s.city))
    );
    console.log(
      'Station LGAs:',
      stations.map((s) => s.city)
    );
    const filtered = stations.filter(
      (station) => normalizeLgaName(station.city) === normalizeLgaName(lga)
    );
    setFilteredStations(filtered);
  }, [stations, lga]);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View>
          <TouchableOpacity onPress={logout} className="text-xl">
            <Text>Logout</Text>
          </TouchableOpacity>
          {/* ------ address ------ */}
          <View className="mb-[24px] flex flex-row">
            <View className="mr-[8px]">
              <Location color={'#0095C7'} width={16} height={16} />
            </View>
            <TouchableOpacity
              className="flex flex-row"
              onPress={() => router.push('/address')}
            >
              <Text className="mr-[8px]">
                {address ? address : `Choose Location`}
              </Text>
              <ArrowDown color={'#1A201D'} width={16} height={16} />
            </TouchableOpacity>
          </View>
          {/* ------ stations displayed ------ */}
          <View style={styles.main}>
            {filteredStations.map((station) => (
              <StationCard
                key={station.id}
                stationName={station.stationName}
                image={station.image}
                prices={station.prices}
                stockAvailable={station.availability}
                onPress={() =>
                  router.push({
                    pathname: '/station/[stationId]',
                    params: { stationId: station.id },
                  })
                }
              />
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
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

import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { StationCard } from '@/components/StationCard';
import { fetchCrowdFuelPrices } from '@/api/crowdFuelPrice';
import { useEffect, useState } from 'react';
import { transformCrowdFuelData } from '@/utils/transformCrowdFuelData';
import { StationCardTransformed } from '@/types/stationCardTransformed';

export default function HomeScreen() {
  const { user } = useAuth();
  const [stations, setStations] = useState<StationCardTransformed[]>([]);

  // useEffect(() => {
  //   fetchCrowdFuelPrices()
  //     .then(setStations)
  //     .catch((err) => console.error('Error fetching stations:', err));
  //     console.log(stations)
  // }, []);

  useEffect(() => {
    fetchCrowdFuelPrices()
      .then((raw) => {
        const formatted = transformCrowdFuelData(raw);
        setStations(formatted);
      })
      .catch((err) => {
        console.log('Error fetching stations:', err);
      });
  }, []);

  return (
    <ScrollView>
      <View style={styles.container}>
        <View style={styles.main}>
          {stations.map((station) => (
            <StationCard
              key={station.id}
              stationName={station.stationName}
              image={station.image}
              prices={station.prices}
              stockAvailable={station.availability}
            />
          ))}
        </View>
      </View>
    </ScrollView>
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

import { ScrollView, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams } from 'expo-router';

export default function StationPage() {
  const params = useLocalSearchParams<{ stationId?: string | string[] }>();
  const stationIdParam = params.stationId;
  const stationId = Array.isArray(stationIdParam)
    ? stationIdParam[0]
    : stationIdParam;

  return (
    <SafeAreaView>
      <ScrollView>
        <View className="p-4">
          <Text>{stationId ?? 'No station selected'}</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

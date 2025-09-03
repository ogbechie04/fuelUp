import { View, Text, StyleSheet } from 'react-native';

export default function TestRoute() {
  console.log('=== TEST ROUTE RENDERING ===');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Route Works!</Text>
      <Text style={styles.subtitle}>If you see this, Expo Router is working</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'white',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
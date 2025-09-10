import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/auth-context';
import { StationCard } from '@/components/StationCard';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <StationCard/>
        <Text style={styles.title}>Welcome to Your App!</Text>
        <Text style={styles.subtitle}>You are successfully logged in.</Text>
        {user && (
          <Text style={styles.userInfo}>Hello, {user.first_name || 'User'}!</Text>
        )}
      </View>
    </View>
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
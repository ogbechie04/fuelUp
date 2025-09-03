import { StyleSheet, Text, View } from 'react-native';
import { useAuth } from '@/context/auth-context';

export default function HomeScreen() {
  const { user } = useAuth(); // Assuming you have user data in context

  return (
    <View style={styles.container}>
      <View style={styles.main}>
        <Text style={styles.title}>Welcome to Your App!</Text>
        <Text style={styles.subtitle}>You are successfully logged in.</Text>
        {user && (
          <Text style={styles.userInfo}>Hello, {user.name || 'User'}!</Text>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
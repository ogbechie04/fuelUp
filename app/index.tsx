import { useAuth } from '@/context/auth-context';
import { Redirect } from 'expo-router';
import { useEffect } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import SplashIcon from '@/assets/icon/splash-screen-icon.svg'

export default function Index() {
  console.log('=== INDEX COMPONENT RENDERING ===');
  const { token, loading, user } = useAuth();

  console.log('Index - Loading:', loading);

  if (loading) {
    console.log('Index - Showing loading state');
    return (
      <View style={styles.container}>
        {/* <ActivityIndicator size="large" color="#007095" /> */}
        <SplashIcon />
      </View>
    );
  }

  // Redirect based on auth state
  if (token) {
    console.log('Index - Redirecting to tabs (user is logged in)');
    return <Redirect href="/(tabs)" />;
  } else {
    console.log('Index - Redirecting to login (no token)');
    return <Redirect href="/(auth)/login" />;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#007095',
  },
});

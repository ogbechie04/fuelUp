import { ExpoConfig, ConfigContext } from 'expo/config';

const MAPBOX_DOWNLOAD_TOKEN = process.env.RN_MAPBOX_DOWNLOAD_TOKEN ?? 'sk.ey..';

export default ({ config }: ConfigContext): ExpoConfig => ({
  ...config,
  name: 'fuelUp',
  slug: 'fuelUp',
  version: '1.0.0',
  orientation: 'portrait',
  icon: './assets/icon/icon.png',
  scheme: 'fuelup',
  owner: 'ogbechie',
  userInterfaceStyle: 'automatic',
  newArchEnabled: true,
  ios: {
    supportsTablet: true,
    bundleIdentifier: 'com.anonymous.fuelUp',
  },
  android: {
    package: 'com.anonymous.fuelUp',
    adaptiveIcon: {
      foregroundImage: './assets/images/adaptive-icon.png',
      backgroundColor: '#007095',
    },
    edgeToEdgeEnabled: true,
  },
  web: {
    bundler: 'metro',
    output: 'static',
    favicon: './assets/images/favicon.png',
  },
  extra: {
    RNMapboxMapsDownloadToken: MAPBOX_DOWNLOAD_TOKEN,
    eas: {
      projectId: '1bf8ddc7-f2e5-48a9-ae78-b6b267b2b7aa',
    },
  },
  plugins: [
    'expo-router',
    [
      'expo-splash-screen',
      {
        image: './assets/images/splash-icon.png',
        imageWidth: 200,
        resizeMode: 'contain',
        backgroundColor: '#007095',
      },
    ],
    [
      '@rnmapbox/maps',
      {
        RNMapboxMapsDownloadToken: MAPBOX_DOWNLOAD_TOKEN,
      },
    ],
    [
      'expo-location',
      {
        locationWhenInUsePermission:
          'Allow FuelUp to use your location to find nearby filling stations.',
        locationAlwaysAndWhenInUsePermission:
          'Allow FuelUp to use your location even when the app is in the background.',
      },
    ],
    'expo-font',
  ],
  experiments: {
    typedRoutes: true,
  },
});

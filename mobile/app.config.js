export default {
  expo: {
    name: 'Bridge Academy',
    slug: 'bridge-academy',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash.png',
      resizeMode: 'contain',
      backgroundColor: '#1e40af'
    },
    updates: {
      fallbackToCacheTimeout: 0
    },
    assetBundlePatterns: ['**/*'],
    ios: {
      supportsTabletMode: true,
      bundleIdentifier: 'com.crosslife.bridgeacademy'
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#1e40af'
      },
      package: 'com.crosslife.bridgeacademy'
    },
    web: {
      favicon: './assets/favicon.png'
    },
    plugins: [
      [
        'expo-notifications',
        {
          icon: './assets/notification-icon.png',
          color: '#1e40af'
        }
      ],
      [
        'expo-file-system',
        {
          documentDirectory: 'BridgeAcademy'
        }
      ]
    ]
  }
};

import 'dotenv/config';

export default {
  expo: {
    name: 'lmca',
    slug: 'lmca',
    version: '1.0.0',
    orientation: 'portrait',
    icon: './assets/images/mower-logo.png',
    scheme: 'myapp',
    userInterfaceStyle: 'automatic',
    splash: {
      image: './assets/images/mower-logo.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    ios: {
      supportsTablet: true,
    },
    android: {
      adaptiveIcon: {
        foregroundImage: './assets/images/mower-logo.png',
        backgroundColor: '#ffffff',
      },
    },
    web: {
      bundler: 'metro',
      output: 'static',
      favicon: './assets/images/mower-logo.png',
    },
    plugins: ['expo-router'],
    experiments: {
      typedRoutes: true,
    },
    extra: {
      router: {
        origin: false,
      },
      eas: {
        projectId: '7044d8eb-5697-4370-8377-74cbbaba08bd',
      },
      meteomaticsUsername: process.env.METEOMATIC_USERNAME,
      meteomaticsPassword: process.env.METEOMATIC_PASSWORD,
    },
    owner: 'noahvaden',
  },
};

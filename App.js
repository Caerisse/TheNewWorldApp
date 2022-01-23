import React, { useState } from 'react';
import { Image } from 'react-native';
import AppLoading from 'expo-app-loading';
import { useFonts } from '@use-expo/font';
import { Asset } from 'expo-asset';
import { Block, GalioProvider } from 'galio-framework';
import { NavigationContainer } from '@react-navigation/native';
import { enableScreens } from 'react-native-screens';
import Screens from './navigation/examples/Screens';
import { Images, articles, appTheme } from './constants/examples';

enableScreens();

// cache app images // TODO make this in a non exhaustive way
const assetImages = [
  Images.Onboarding,
  Images.LogoOnboarding,
  Images.Logo,
  Images.Pro,
  Images.ArgonLogo,
  Images.iOSLogo,
  Images.androidLogo,
];

// cache product images
articles.map((article) => assetImages.push(article.image));

function cacheImages(images) {
  return images.map((image) => {
    if (typeof image === 'string') {
      return Image.prefetch(image);
    }
    return Asset.fromModule(image).downloadAsync();
  });
}

export default function Main() {
  const [isLoadingComplete, setLoading] = useState(false);
  const [fontsLoaded] = useFonts({
    // eslint-disable-next-line global-require
    ArgonExtra: require('./assets/font/argon.ttf'),
  });

  function loadResourcesAsync() {
    return Promise.all([...cacheImages(assetImages)]);
  }

  function handleLoadingError(error) {
    // In this case, you might want to report the error to your error
    // reporting service, for example Sentry
    console.warn(error);
  }

  function handleFinishLoading() {
    setLoading(true);
  }

  if (!fontsLoaded && !isLoadingComplete) {
    return (
      <AppLoading
        startAsync={loadResourcesAsync}
        onError={handleLoadingError}
        onFinish={handleFinishLoading}
      />
    );
  }
  if (fontsLoaded) {
    return (
      <NavigationContainer>
        <GalioProvider theme={appTheme}>
          <Block flex>
            <Screens />
          </Block>
        </GalioProvider>
      </NavigationContainer>
    );
  }
  return null;
}

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useRef} from 'react';
import {AppState, Button, Platform} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {MMKV} from 'react-native-mmkv';
const storage = new MMKV({
  id: 'UserInactivity',
});

const LOCK_TIME = 3000;

export const UserInactivityProvider = ({children}: any) => {
  const navigation = useNavigation();
  const appState = useRef(AppState.currentState);
  ///const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription?.remove();
    };
  }, []);

  <Button
    title="Go to Details"
    onPress={() => navigation.navigate('MainApp' as never)}
  />;
  const handleAppStateChange = (nextAppState: any) => {
    // console.log('appstate', appState.current, nextAppState);
    // if (
    //   appState.current.match(/inactive|background/) &&
    //   nextAppState.match(/active/)
    // ) {
    //   setTimeout(() => {
    //     navigation.navigate('Blur' as never);
    //   }, 800);
    // } else if (
    //   appState.current.match(/active/) &&
    //   nextAppState.match(/inactive|background/)
    // ) {
    //   if (navigation.canGoBack()) {
    //     console.log(navigation.getState());
    //     navigation.goBack();
    //   }
    // }
    // if (nextAppState === 'inactive') {
    //   navigation.navigate('Blur' as never);
    // } else {
    //   console.log(navigation.canGoBack());
    //   if (navigation.canGoBack()) {
    //     console.log(navigation.getState());
    //     navigation.goBack();
    //   }
    // }
    if (nextAppState === 'background') {
      recordStartTime();
    } else if (
      nextAppState === 'active' &&
      appState.current.match(/background/)
    ) {
      const elapsed = Date.now() - (storage.getNumber('startTime') || 0);
      console.log(elapsed);
      if (elapsed > LOCK_TIME) {
        navigation.navigate('Lock' as never);
      }
    }

    appState.current = nextAppState;
  };

  const recordStartTime = () => {
    storage.set('startTime', Date.now());
  };
  return children;
};

import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useRef} from 'react';
import {AppState, Button} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';

const storeInactivity = async (inactiveTime: string) => {
  try {
    await AsyncStorage.setItem('UserInactivity', inactiveTime);
  } catch (e) {
    console.log('error saving');
  }
};

const getInactivity = async () => {
  try {
    const inactiveTime = await AsyncStorage.getItem('UserInactivity');
    if (inactiveTime) return inactiveTime!;
  } catch (e) {
    console.log('error fetching');
  }
};

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
      subscription.remove();
    };
  }, []);

  <Button
    title="Go to Details"
    onPress={() => navigation.navigate('MainApp' as never)}
  />;
  const handleAppStateChange = (nextAppState: any) => {
    console.log('appstate', appState.current, nextAppState);

    if (nextAppState === 'inactive') {
      navigation.navigate('Blur' as never);
    } else {
      if (navigation.canGoBack()) {
        navigation.goBack();
      }
    }

    if (nextAppState === 'background') {
      recordStartTime();
    } else if (
      nextAppState === 'active' &&
      appState.current.match(/background/)
    ) {
      let parsed = getInactivity().then(x => {
        x!;
      });
      //const elapsed = Date.now() - Number.parseInt();
    }

    appState.current = nextAppState;
  };

  const recordStartTime = async () => {
    await storeInactivity(Date.now().toString());
  };
  return children;
};

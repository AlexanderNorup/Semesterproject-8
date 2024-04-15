import {useEffect, useRef} from 'react';
import {AppState} from 'react-native';

export const UserInactivityProvider = ({children}: any) => {
  const appState = useRef(AppState.currentState);
  const router = useRouter();

  useEffect(() => {
    const subscription = AppState.addEventListener(
      'change',
      handleAppStateChange,
    );

    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState: any) => {
    console.log('appstate', appState.current, nextAppState);

    appState.current = nextAppState;
  };
};

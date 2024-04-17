import React from 'react';
import {UserInactivityProvider} from '../UserInactivity';
import {View, Text} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import App from '../App';
import Blur from '../modals/blur';
import Lock from '../modals/lock';

const Stack = createNativeStackNavigator();

export default function Layout() {
  return (
    <NavigationContainer>
      <UserInactivityProvider>
        <Stack.Navigator>
          {/* <Stack.Screen name="Blur" component={blur} /> */}
          <Stack.Screen
            name="Lock"
            component={Lock}
            options={{headerShown: false, animation: 'none'}}
          />
          <Stack.Screen
            name="Blur"
            component={Blur}
            options={{headerShown: false, animation: 'none'}}
          />
          <Stack.Screen
            name="MainApp"
            component={App}
            options={{headerShown: false, animation: 'none'}}
          />
        </Stack.Navigator>
      </UserInactivityProvider>
    </NavigationContainer>
  );
}

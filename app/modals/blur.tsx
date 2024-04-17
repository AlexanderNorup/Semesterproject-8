import {View, Text, StyleSheet, Image} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useEffect, useRef} from 'react';
import {AppState, Button} from 'react-native';

import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {useNavigation} from '@react-navigation/native';
import {BlurView} from '@react-native-community/blur';
import Icon from 'react-native-vector-icons/FontAwesome5';

const Page = () => {
  return (
    <View
      style={{
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
      }}>
      <Image
        source={require('../assets/no_look.png')}
        style={{resizeMode: 'center'}}></Image>
    </View>
  );
};
export default Page;

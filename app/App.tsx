/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  Button,
  FlatList,
  ImageBackground,
  PermissionsAndroid,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  useColorScheme,
  View,
} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {RoundButton} from './RoundButton';
import {COLORS} from './Colors';
import BackgroundAnimation from './BackgroundAnimation';
import {_BleManager} from './bluetooth_manager';
import {Characteristic, Device, State} from 'react-native-ble-plx';
import BLE from './BLE';
import DeviceModal from './ConnectionModal';
import CharacteristicModal from './CharacteristicModal';

function App(): React.JSX.Element {
  const {
    requestPermissions,
    scanForPeripherals,
    allDevices,
    connectToDevice,
    connectedDevice,
    allCharacteristics,
    chosenCharacteristic,
    attachToCharacteristic,
    disconnectFromDevice,
    doorStatus,
    setDoorState,
    exportDoorStatus,
    getLastDeviceConnection,
    connectToPreviousDevice,
  } = BLE();

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isCharModalVisible, setIsCharModalVisible] = useState<boolean>(false);
  const [hasPreviousConnectedDevice, setHasPreviousConnectedDevice] =
    useState<boolean>(false);

  const scanForDevices = async () => {
    const isPermissionsEnabled = await requestPermissions();
    if (isPermissionsEnabled) {
      scanForPeripherals();
    }
  };

  const hideModal = () => {
    setIsModalVisible(false);
  };

  const openModal = async () => {
    scanForDevices();
    setIsModalVisible(true);
  };

  const openCharModel = async () => {
    setIsCharModalVisible(true);
  };

  const hideCharModal = () => {
    setIsCharModalVisible(false);
  };

  useEffect(() => {
    if (
      getLastDeviceConnection() !== null ||
      getLastDeviceConnection() !== undefined
    ) {
      getLastDeviceConnection().then(x => {
        connectToPreviousDevice(x!);
      });
    }
  }, []);

  return (
    <View style={styles.img_container}>
      <View style={styles.container}>
        <SafeAreaView style={styles.container}>
          <View style={styles.titleWrapper}>
            {connectedDevice ? (
              <>
                <Text style={styles.titleText}>Status of door:</Text>
                <Text
                  style={
                    exportDoorStatus ? styles.highlightG : styles.highlightR
                  }>
                  {doorStatus}
                </Text>
                <CharacteristicModal
                  device={connectedDevice}
                  characteristics={allCharacteristics}
                  visible={isCharModalVisible}
                  attachToCharacteristic={attachToCharacteristic}
                  closeModal={hideCharModal}
                />

                <View style={styles.buttonStyleContainer}>
                  <RoundButton
                    title="Open"
                    icon="lock-open"
                    onPress={() => setDoorState(true)}
                    isOpen={true}
                  />
                  <RoundButton
                    title="Lock"
                    icon="lock"
                    onPress={() => setDoorState(false)}
                    isOpen={false}
                  />
                </View>
              </>
            ) : (
              <Text style={styles.titleText}>Connect to the Doorlock</Text>
            )}
          </View>

          <TouchableOpacity
            onPress={connectedDevice ? disconnectFromDevice : openModal}
            style={
              connectedDevice
                ? [styles.ctaButton, {backgroundColor: COLORS.LIGHT_RED}]
                : styles.ctaButton
            }>
            <Text
              style={
                connectedDevice
                  ? [styles.ctaButtonText, {color: COLORS.WHITE}]
                  : styles.ctaButtonText
              }>
              {connectedDevice ? 'Disconnect' : 'Connect'}
            </Text>
          </TouchableOpacity>
          <DeviceModal
            closeModal={hideModal}
            visible={isModalVisible}
            connectToPeripheral={connectToDevice}
            devices={allDevices}
          />
        </SafeAreaView>
      </View>
    </View>
  );
}

/*
// Reconnection module
 {connectedDevice ? (
              <>
                <Text style={styles.highlightR}>Connection Lost</Text>
                <TouchableOpacity
                  onPress={() =>
                    getLastDeviceConnection().then(x => {
                      connectToPreviousDevice(x!);
                    })
                  }
                  style={
                    connectedDevice
                      ? [styles.ctaButton, {backgroundColor: '#f34545'}]
                      : styles.ctaButton
                  }>
                  <Text style={styles.ctaButtonText}>Reconnect </Text>
                </TouchableOpacity>
              </>
            ) : (
              <Text> </Text>
            )}

*/

const styles = StyleSheet.create({
  img_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    backgroundColor: '#2073f7',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyleContainer: {
    flex: 1,
    columnGap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
  },
  highlightR: {
    fontWeight: '900',
    fontSize: 30,
    color: COLORS.LIGHT_RED,
    marginTop: 8,
    textShadowColor: '#585858',
    textAlign: 'center',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  highlightG: {
    fontWeight: '900',
    fontSize: 30,
    marginTop: 8,
    color: COLORS.LIGHT_GREEN,
    textAlign: 'center',
    textShadowColor: '#585858',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 1,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
  titleWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    textAlign: 'center',
  },
  titleText: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginHorizontal: 20,
    color: COLORS.WHITE,
  },
  ctaButton: {
    backgroundColor: COLORS.WHITE,
    justifyContent: 'center',
    alignItems: 'center',
    height: 60,
    width: 'auto',
    paddingHorizontal: 30,
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
  },
  ctaButtonText: {
    fontSize: 26,
    fontWeight: 'bold',
    color: COLORS.CTA,
  },
});

export default App;

import {useEffect, useMemo, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  BleError,
  BleErrorCode,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import {_BleManager} from './bluetooth_manager';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface BluetoothLowEnergyApi {
  requestPermissions(): Promise<boolean>;
  scanForPeripherals(): void;
  connectToDevice: (deviceId: Device) => Promise<void>;
  disconnectFromDevice: () => void;
  attachToCharacteristic: () => void;
  setDoorState: (openDoor: boolean) => void;
  connectedDevice: Device | null;
  chosenCharacteristic: Characteristic | null;
  allCharacteristics: Characteristic[];
  allDevices: Device[];
  doorStatus: String;
  doorTime: number;
  exportDoorStatus: Boolean;
  getLastDeviceConnection(): Promise<string | null | undefined>;
  connectToPreviousDevice: (deviceID: string) => Promise<void>;
}

function BLE(): BluetoothLowEnergyApi {
  const bleManager = _BleManager;
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [doorStatus, setDoorStatus] = useState<String>('');
  const [doorTime, setDoorTime] = useState<number>(0);
  const [variableDoorTime, setVariableDoorTime] = useState<number>(0);
  const [exportDoorStatus, setExportDoorStatus] = useState<Boolean>(false);
  const [chosenCharacteristic, setChosenCharacteristic] =
    useState<Characteristic | null>(null);
  const [allCharacteristics, setAllCharacteristics] = useState<
    Characteristic[]
  >([]);

  let intervalHandle: ReturnType<typeof setTimeout>;

  //const DOOR_LOCK_UUID = 'fb349b5f-8000-0080-0010-0000180D0000';
  const DOOR_LOCK_UUID = '0000180d-0000-1000-8000-00805f9b34fb';
  const DOOR_HEART_RATE_CHARACTERISTIC = '00002a39-0000-1000-8000-00805f9b34fb';

  const requestAndroid31Permissions = async () => {
    const bluetoothScanPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_SCAN,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      },
    );
    const bluetoothConnectPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.BLUETOOTH_CONNECT,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      },
    );
    const fineLocationPermission = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
      {
        title: 'Location Permission',
        message: 'Bluetooth Low Energy requires Location',
        buttonPositive: 'OK',
      },
    );

    return (
      bluetoothScanPermission === 'granted' &&
      bluetoothConnectPermission === 'granted' &&
      fineLocationPermission === 'granted'
    );
  };

  const requestPermissions = async () => {
    if (Platform.OS === 'android') {
      const apiLevel = parseInt(Platform.Version.toString(), 10);
      if (apiLevel < 31) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
          {
            title: 'Location Permission',
            message: 'Bluetooth Low Energy requires Location',
            buttonPositive: 'OK',
          },
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
      } else {
        const isAndroid31PermissionsGranted =
          await requestAndroid31Permissions();

        return isAndroid31PermissionsGranted;
      }
    } else {
      return true;
    }
  };

  const isDuplicateDevice = (devices: Device[], nextDevice: Device) =>
    devices.findIndex(device => nextDevice.id === device.id) > -1;

  const scanForPeripherals = () =>
    bleManager.startDeviceScan(null, null, (error, device) => {
      if (error) {
        console.log(error);
      }
      if (device && device.name?.includes('Doorlock')) {
        setAllDevices((prevState: Device[]) => {
          if (!isDuplicateDevice(prevState, device)) {
            return [...prevState, device];
          }
          return prevState;
        });
      }
    });

  const saveLastDeviceConnection = async (deviceID: string) => {
    try {
      await AsyncStorage.setItem('lastDeviceID', deviceID);
    } catch (e) {
      console.log('error saving');
    }
  };

  const getLastDeviceConnection = async () => {
    try {
      const deviceID = await AsyncStorage.getItem('lastDeviceID');
      return deviceID;
    } catch (e) {
      console.log('error fetching');
    }
  };
  const connectToPreviousDevice = async (deviceID: string) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(deviceID);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      await bleManager.stopDeviceScan();
      // startStreamingData(deviceConnection);
      clearInterval(intervalHandle);
      intervalHandle = setInterval(() => {
        fetchDoorData(deviceConnection);
      }, 1000);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      await saveLastDeviceConnection(device.id);
      setConnectedDevice(deviceConnection);
      await deviceConnection.discoverAllServicesAndCharacteristics();
      await bleManager.stopDeviceScan();
      // startStreamingData(deviceConnection);
      fetchDoorData(deviceConnection);
      clearInterval(intervalHandle);
      intervalHandle = setInterval(() => {
        fetchDoorData(deviceConnection);
      }, 1000);
    } catch (e) {
      console.log('FAILED TO CONNECT', e);
    }
  };

  const disconnectFromDevice = () => {
    if (connectedDevice) {
      bleManager.cancelDeviceConnection(connectedDevice.id);
      setConnectedDevice(null);
      setDoorStatus('not connected');
      clearInterval(intervalHandle);
    }
  };

  const onDoorStatusUpdate = (characteristic: Characteristic | null) => {
    if (!characteristic?.value) {
      console.log('No Data was recieved');
      return -1;
    }

    const rawData = base64.decode(characteristic.value);

    const doorIsOpen = rawData.charCodeAt(0) == 0x01;
    let doorTime = 0;
    for (var i = 1; i < rawData.length; i++) {
      //localDoorTime = doorTime + Math.pow(255, i - 1) * rawData.charCodeAt(i);
      //setDoorTime(localDoorTime);
      //setVariableDoorTime(localDoorTime);
      doorTime = doorTime + Math.pow(255, i - 1) * rawData.charCodeAt(i);
    }
    setDoorTime(doorTime);

    setDoorStatus(doorIsOpen ? 'Unlocked' : 'Locked');
    setExportDoorStatus(doorIsOpen);
  };

  // const startStreamingData = async (device: Device) => {
  //   if (device) {
  //     device.monitorCharacteristicForService(
  //       DOOR_LOCK_UUID,
  //       DOOR_HEART_RATE_CHARACTERISTIC,
  //       onDoorStatusUpdate,
  //     );
  //   } else {
  //     console.log('No Device Connected');
  //   }
  // };

  const fetchDoorData = async (device: Device) => {
    if (device) {
      let char = device.readCharacteristicForService(
        DOOR_LOCK_UUID,
        DOOR_HEART_RATE_CHARACTERISTIC,
      );
      try {
        let c = await char;
        onDoorStatusUpdate(c);
      } catch (e) {
        if (e instanceof BleError) {
          if (e.errorCode == BleErrorCode.DeviceNotConnected) {
            try {
              // intervalHandle = setInterval(() => {
              //   getLastDeviceConnection().then(x => {
              //     connectToPreviousDevice(x!);
              //   });
              // }, 3000);
              setDoorStatus('Device not connected');
              disconnectFromDevice();
            } catch (e) {
              setDoorStatus('Error in deviceconnected: ' + e);
              console.log(e);
            }
          } else if (e.errorCode == BleErrorCode.DeviceDisconnected) {
            setDoorStatus('Device disconnected: ' + e);
          } else {
            setDoorStatus('Unkown BLEError: ' + e);
          }
        }
      }
    }
  };
  const attachToCharacteristic = async () => {
    try {
      // bleManager.readCharacteristicForDevice();
    } catch (e) {
      console.log('FAILED', e);
    }
  };

  const setDoorState = async (open: Boolean) => {
    if (!connectedDevice) {
      return;
    }
    try {
      let openCloseByte = open ? 0x13 : 0x42;
      let commandPayload = Uint8Array.from([openCloseByte]);

      let timePayload = Uint8Array.from([
        doorTime & 0x000000ff,
        (doorTime & 0x0000ff00) >> 8,
        (doorTime & 0x00ff0000) >> 16,
        (doorTime & 0xff000000) >> 24,
      ]);

      console.log(doorTime);

      var payload = new Uint8Array(commandPayload.length + timePayload.length);
      payload.set(commandPayload);
      payload.set(timePayload, commandPayload.length);

      let base64Encoded = base64.encodeFromByteArray(payload);

      await connectedDevice.writeCharacteristicWithResponseForService(
        DOOR_LOCK_UUID,
        DOOR_HEART_RATE_CHARACTERISTIC,
        base64Encoded,
      );
      fetchDoorData(connectedDevice);
    } catch (e) {
      setDoorStatus(e + '');
    }
  };

  return {
    scanForPeripherals,
    requestPermissions,
    connectToDevice,
    allDevices,
    allCharacteristics,
    connectedDevice,
    attachToCharacteristic,
    chosenCharacteristic,
    disconnectFromDevice,
    doorStatus,
    doorTime,
    setDoorState,
    exportDoorStatus,
    getLastDeviceConnection,
    connectToPreviousDevice,
  };
}

export default BLE;

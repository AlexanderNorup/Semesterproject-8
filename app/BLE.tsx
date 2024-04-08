import {useEffect, useMemo, useState} from 'react';
import {PermissionsAndroid, Platform} from 'react-native';
import {
  BleError,
  BleManager,
  Characteristic,
  Device,
} from 'react-native-ble-plx';
import base64 from 'react-native-base64';
import {_BleManager} from './bluetooth_manager';

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
  exportDoorStatus: Boolean;
}

function BLE(): BluetoothLowEnergyApi {
  const bleManager = _BleManager;
  const [allDevices, setAllDevices] = useState<Device[]>([]);
  const [connectedDevice, setConnectedDevice] = useState<Device | null>(null);
  const [doorStatus, setDoorStatus] = useState<String>('');
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

  const connectToDevice = async (device: Device) => {
    try {
      const deviceConnection = await bleManager.connectToDevice(device.id);
      setConnectedDevice(deviceConnection);
      var d = await deviceConnection.discoverAllServicesAndCharacteristics();

      bleManager.stopDeviceScan();
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
      doorTime = doorTime + Math.pow(255, i - 1) * rawData.charCodeAt(i);
    }

    setDoorStatus((doorIsOpen ? 'Open' : 'Closed') + '\nTime: ' + doorTime);
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
        setDoorStatus(new Date() + 'err: ' + e);
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
      let inputTime = 10;
      let openCloseByte = open ? 0x13 : 0x42;
      let payload = Uint8Array.from([openCloseByte]);

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
    setDoorState,
    exportDoorStatus,
  };
}

export default BLE;

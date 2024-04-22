import React, {FC, useCallback} from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  Modal,
  SafeAreaView,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  View,
} from 'react-native';
import {Device} from 'react-native-ble-plx';
import {COLORS} from './Colors';
import {scale} from 'react-native-size-matters';

const bgImage = require('./assets/bg_popup.png');

type DeviceModalListItemProps = {
  item: ListRenderItemInfo<Device>;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

type DeviceModalProps = {
  devices: Device[];
  visible: boolean;
  connectToPeripheral: (device: Device) => void;
  closeModal: () => void;
};

const DeviceModalListItem: FC<DeviceModalListItemProps> = props => {
  const {item, connectToPeripheral, closeModal} = props;

  const connectAndCloseModal = useCallback(() => {
    connectToPeripheral(item.item);
    closeModal();
  }, [closeModal, connectToPeripheral, item.item]);

  return (
    <TouchableOpacity
      onPress={connectAndCloseModal}
      style={modalStyle.ctaButton}>
      <Text style={modalStyle.ctaButtonText}>{item.item.name}</Text>
    </TouchableOpacity>
  );
};

const DeviceModal: FC<DeviceModalProps> = props => {
  const {devices, visible, connectToPeripheral, closeModal} = props;

  const renderDeviceModalListItem = useCallback(
    (item: ListRenderItemInfo<Device>) => {
      return (
        <DeviceModalListItem
          item={item}
          connectToPeripheral={connectToPeripheral}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, connectToPeripheral],
  );

  return (
    <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}>
      <View style={modalStyle.modalTitle}>
        <ImageBackground
          style={modalStyle.img_container}
          source={bgImage}
          resizeMode="cover">
          <SafeAreaView>
            <Text style={modalStyle.modalTitleText}>
              Tap on the doorlock to connect
            </Text>
            <FlatList
              contentContainerStyle={modalStyle.modalFlatlistContiner}
              data={devices}
              renderItem={renderDeviceModalListItem}
            />
          </SafeAreaView>
        </ImageBackground>
      </View>
    </Modal>
  );
};

const modalStyle = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: COLORS.TERTIARY,
  },
  img_container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  modalFlatlistContiner: {
    flex: 1,
    justifyContent: 'center',
    color: COLORS.BLACK,
  },
  modalCellOutline: {
    borderWidth: 1,
    borderColor: 'black',
    alignItems: 'center',
    marginHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 16,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: COLORS.TERTIARY,
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: scale(28),
    fontWeight: 'bold',
    marginHorizontal: 20,
    textAlign: 'center',
    color: COLORS.CTA,
  },
  ctaButton: {
    backgroundColor: COLORS.CTA,
    justifyContent: 'center',
    alignItems: 'center',
    height: scale(44),
    width: 'auto',
    marginHorizontal: scale(38),
    marginBottom: 5,
    borderRadius: 20,
  },
  ctaButtonText: {
    fontSize: scale(20),
    fontWeight: '600',
    color: COLORS.WHITE,
    paddingHorizontal: scale(20),
  },
});

export default DeviceModal;

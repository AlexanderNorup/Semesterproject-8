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
} from 'react-native';
import {Characteristic, Device} from 'react-native-ble-plx';
import {COLORS} from './Colors';

const bgImage = require('./assets/bg_popup.png');

type CharacteristicModalListItemProps = {
  item: ListRenderItemInfo<Characteristic>;
  attachToCharacteristic: (characteristic: Characteristic) => void;
  closeModal: () => void;
};

type CharacteristicModalProps = {
  device: Device;
  characteristics: Characteristic[];
  visible: boolean;
  attachToCharacteristic: (characteristic: Characteristic) => void;
  closeModal: () => void;
};

const CharacteristicModalListItem: FC<
  CharacteristicModalListItemProps
> = props => {
  const {item, attachToCharacteristic, closeModal} = props;

  const attachAndCloseModal = useCallback(() => {
    attachToCharacteristic(item.item);
    closeModal();
  }, [closeModal, attachToCharacteristic, item.item]);

  return (
    <TouchableOpacity
      onPress={attachAndCloseModal}
      style={modalStyle.ctaButton}>
      <Text style={modalStyle.ctaButtonText}>{item.item.serviceID}</Text>
    </TouchableOpacity>
  );
};

const CharacteristicModal: FC<CharacteristicModalProps> = props => {
  const {device, characteristics, visible, attachToCharacteristic, closeModal} =
    props;

  const renderCharacteristicModalListItem = useCallback(
    (item: ListRenderItemInfo<Characteristic>) => {
      return (
        <CharacteristicModalListItem
          item={item}
          attachToCharacteristic={attachToCharacteristic}
          closeModal={closeModal}
        />
      );
    },
    [closeModal, attachToCharacteristic],
  );

  return (
    <Modal
      style={modalStyle.modalContainer}
      animationType="slide"
      transparent={false}
      visible={visible}>
      <SafeAreaView style={modalStyle.modalTitle}>
        <ImageBackground
          style={modalStyle.img_container}
          source={bgImage}
          resizeMode="cover">
          <Text style={modalStyle.modalTitleText}>
            Tap on a device to connect
          </Text>
          <FlatList
            contentContainerStyle={modalStyle.modalFlatlistContiner}
            data={characteristics}
            renderItem={renderCharacteristicModalListItem}
          />
        </ImageBackground>
      </SafeAreaView>
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
    borderRadius: 8,
  },
  modalTitle: {
    flex: 1,
    backgroundColor: COLORS.TERTIARY,
  },
  modalTitleText: {
    marginTop: 40,
    fontSize: 30,
    fontWeight: 'bold',
    marginHorizontal: 20,
    textAlign: 'center',
    color: COLORS.BLACK,
  },
  ctaButton: {
    backgroundColor: COLORS.CTA,
    justifyContent: 'center',
    alignItems: 'center',
    height: 50,
    marginHorizontal: 20,
    marginBottom: 5,
    borderRadius: 8,
  },
  ctaButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
});

export default CharacteristicModal;

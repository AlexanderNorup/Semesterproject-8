import {PropsWithChildren, PropsWithoutRef, ReactNode} from 'react';
import {
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {COLORS} from './Colors';
import Icon from 'react-native-vector-icons/FontAwesome5';

export const RoundButton = ({
  onPress,
  title,
  icon,
  isOpen,
}: {
  onPress: any;
  title: string;
  icon: string;
  isOpen: Boolean;
}) => (
  <SafeAreaView>
    <TouchableOpacity
      onPress={onPress}
      style={isOpen ? styles.openButton : styles.button}>
      <Text style={isOpen ? styles.openButtonTitle : styles.buttonTitle}>
        {title}
      </Text>
      <Icon name={icon} style={isOpen ? styles.openIcon : styles.icon} />
    </TouchableOpacity>
  </SafeAreaView>
);

const BUTTON_SIZE = 160;

const styles = StyleSheet.create({
  buttonTitle: {
    fontSize: 35,
    fontWeight: '500',
    color: COLORS.DOOR_RED,
  },
  openButtonTitle: {
    fontSize: 35,
    fontWeight: '500',
    color: COLORS.DOOR_GREEN,
  },
  // button: {
  //   width: BUTTON_SIZE,
  //   height: BUTTON_SIZE,
  //   borderRadius: BUTTON_SIZE,
  //   backgroundColor: COLORS.CTA,
  //   alignItems: 'center',
  //   justifyContent: 'center',
  // },
  button: {
    borderWidth: 10,
    borderColor: COLORS.DOOR_RED,
    alignItems: 'center',
    justifyContent: 'center',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: 'rgba(0,0,0,0.001)',
    borderRadius: 100,
  },
  icon: {
    fontSize: 30,
    color: COLORS.DOOR_RED,
  },
  openButton: {
    borderWidth: 10,
    borderColor: COLORS.DOOR_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: 'rgba(0,0,0,0.001)',
    borderRadius: 100,
  },
  openIcon: {
    fontSize: 30,
    color: COLORS.DOOR_GREEN,
  },
});

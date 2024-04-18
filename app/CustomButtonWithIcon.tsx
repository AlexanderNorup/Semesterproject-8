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

export const CustomButtonWithIcon = ({
  onPress,
  iconName,
  iconSize,
  color,
}: {
  onPress?: any;
  iconName: string;
  iconSize: number;
  color?: string;
}) => (
  <SafeAreaView>
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Icon name={iconName} size={iconSize} color={color} />
    </TouchableOpacity>
  </SafeAreaView>
);

const BUTTON_SIZE = 90;

const styles = StyleSheet.create({
  buttonTitle: {
    fontSize: 32,
    fontWeight: '500',
    color: COLORS.BLACK,
  },

  button: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 10,
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: 'rgba(220,220,220,0.0)',
    borderRadius: 100,
  },
});

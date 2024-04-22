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
import {scale} from 'react-native-size-matters';

export const CustomButton = ({
  onPress,
  title,
}: {
  onPress: any;
  title: string;
}) => (
  <SafeAreaView>
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonTitle}>{title}</Text>
    </TouchableOpacity>
  </SafeAreaView>
);

const BUTTON_SIZE = scale(73);
//const BUTTON_SIZE = scale(80);

const styles = StyleSheet.create({
  buttonTitle: {
    fontSize: scale(32),
    fontWeight: '400',
    color: COLORS.BLACK,
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
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: scale(10),
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: 'rgba(220,220,220,0.0)',
    borderRadius: 100,
  },
});

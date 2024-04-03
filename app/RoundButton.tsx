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
}: {
  onPress: any;
  title: string;
  icon: string;
}) => (
  <SafeAreaView>
    <TouchableOpacity onPress={onPress} style={styles.button}>
      <Text style={styles.buttonTitle}>{title}</Text>
      <Icon name={icon} style={styles.icon} />
    </TouchableOpacity>
  </SafeAreaView>
);

const BUTTON_SIZE = 160;

const styles = StyleSheet.create({
  buttonTitle: {
    fontSize: 40,
    color: '#fff',
  },
  button: {
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    borderRadius: BUTTON_SIZE,
    backgroundColor: COLORS.CTA,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    fontSize: 30,
    color: COLORS.TERTIARY,
  },
});

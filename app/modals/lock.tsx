import {useNavigation} from '@react-navigation/native';
import {useEffect, useState} from 'react';
import {
  View,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../Colors';
import Haptics from 'react-native-haptic-feedback';
import Icon from 'react-native-vector-icons/FontAwesome5';
//import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import TouchID from 'react-native-touch-id';
import * as Keychain from 'react-native-keychain';
import {CustomButton} from '../CustomButton';
import {CustomButtonWithIcon} from '../CustomButtonWithIcon';

const Page = () => {
  const [code, setCode] = useState<number[]>([]);
  const [passCode, setPasscode] = useState<number[]>([]);
  const [passcodeExists, setPasscodeExists] = useState<boolean>(false);
  const codeLength = Array(6).fill(0);
  const passcodeLength = Array(6).fill(0);
  const navigation = useNavigation();

  const offset = useSharedValue(0);
  const style = useAnimatedStyle(() => {
    return {
      transform: [{translateX: offset.value}],
    };
  });
  const ANIMATION_OFFSET = 20;
  const ANIMATION_TIME = 80;

  useEffect(() => {
    if (code.length === 6) {
      (async () => {
        try {
          const credentials = await Keychain.getGenericPassword();
          if (credentials) {
            if (JSON.stringify(code) === credentials.password) {
              navigation.navigate('MainApp' as never);
              setCode([]);
            } else {
              offset.value = withSequence(
                withTiming(-ANIMATION_OFFSET, {duration: ANIMATION_TIME / 2}),
                withRepeat(
                  withTiming(ANIMATION_OFFSET, {duration: ANIMATION_TIME}),
                  4,
                  true,
                ),
                withTiming(0, {duration: ANIMATION_TIME / 2}),
              );
              Haptics.trigger('notificationError');
              setCode([]);
            }
          }
        } catch (error) {
          console.log("Keychain couldn't be accessed!", error);
        }
      })();
    }

    if (passCode.length === 6) {
      Alert.alert('Passcode set!', passCode.join(' '));
      (async () => {
        try {
          await Keychain.setGenericPassword(
            'Doorlock',
            JSON.stringify(passCode),
          );
          setPasscode([]);
        } catch (error) {
          console.log("Keychain couldn't be accessed!", error);
        }
      })();
    }
    (async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          setPasscodeExists(true);
        } else {
          console.log('No credentials stored');
        }
      } catch (error) {
        console.log("Keychain couldn't be accessed!", error);
      }
    })();
  }, [code, passCode]);

  const onPressResetPassword = () => {
    Alert.alert(
      'Reset Password',
      'Are you sure you want to reset your password?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Reset',
          onPress: () => {
            TouchID.authenticate(
              'Authenticate to reset password',
              optionalConfigObject,
            )
              .then(() => {
                Keychain.resetGenericPassword()
                  .then(() => {
                    Alert.alert(
                      'Password Reset',
                      'Your password has been reset successfully.',
                    );
                    setPasscodeExists(false);
                  })
                  .catch(error => {
                    Alert.alert('Error', 'Failed to reset password.');
                    console.log('Error resetting password:', error);
                  });
              })
              .catch((error: any) => {
                Alert.alert(
                  'Authentication Failed',
                  'Biometric authentication failed.',
                );
                console.log('Authentication failed:', error);
              });
          },
        },
      ],
    );
  };

  const onSetPasscode = (number: number) => {
    Haptics.trigger('impactMedium');
    setPasscode([...passCode, number]);
  };

  const onBackspacePasscode = () => {
    Haptics.trigger('impactMedium');
    setPasscode(passCode.slice(0, -1));
    console.log('backspace');
  };

  const onTrashPasscode = () => {
    Haptics.trigger('impactMedium');
    setPasscode([]);
    console.log('trashed');
  };

  const onNumberPress = (number: number) => {
    Haptics.trigger('impactMedium');
    setCode([...code, number]);
  };

  const onBackspace = () => {
    Haptics.trigger('impactMedium');
    setCode(code.slice(0, -1));
  };
  const optionalConfigObject = {
    title: 'Authentication Required', // Android
    imageColor: '#e00606', // Android
    imageErrorColor: '#ff0000', // Android
    sensorDescription: 'Touch sensor', // Android
    sensorErrorDescription: 'Failed', // Android
    cancelText: 'Cancel', // Android
    fallbackLabel: 'Passcode', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

  const onBiometricPress = () => {
    TouchID.authenticate('Authenticate to unlock the app', optionalConfigObject)
      .then((success: any) => {
        navigation.navigate('MainApp' as never);
      })
      .catch((error: any) => {
        Haptics.trigger('notificationError');
      });
  };

  return (
    <SafeAreaView>
      {passcodeExists ? (
        <>
          <Text style={styles.greeting}>Welcome back</Text>
          <Animated.View style={[styles.codeView, style]}>
            {codeLength.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.codeEmpty,
                  {
                    backgroundColor:
                      code[index] !== undefined ? COLORS.CTA : COLORS.PRIMARY,
                  },
                ]}
              />
            ))}
          </Animated.View>
          <View style={styles.numbersView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
              }}>
              {[1, 2, 3].map(number => (
                <CustomButton
                  key={number}
                  onPress={() => onNumberPress(number)}
                  title={number.toString()}
                />
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
              }}>
              {[4, 5, 6].map(number => (
                <CustomButton
                  key={number}
                  onPress={() => onNumberPress(number)}
                  title={number.toString()}
                />
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
              }}>
              {[7, 8, 9].map(number => (
                <CustomButton
                  key={number}
                  onPress={() => onNumberPress(number)}
                  title={number.toString()}
                />
              ))}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <CustomButtonWithIcon
                iconName="fingerprint"
                iconSize={26}
                onPress={onBiometricPress}
              />
              <CustomButton
                title="0"
                onPress={() => onNumberPress(Number.parseInt('0'))}
              />

              <View>
                {code.length > 0 ? (
                  <CustomButtonWithIcon
                    iconName="backspace"
                    iconSize={22}
                    onPress={onBackspace}
                  />
                ) : (
                  <CustomButtonWithIcon
                    iconName="backspace"
                    iconSize={22}
                    color="lightgrey"
                  />
                )}
              </View>
            </View>
            <TouchableOpacity onPress={onPressResetPassword}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: 'bold',
                  alignSelf: 'center',
                  color: COLORS.CTA,
                }}>
                Reset Password
              </Text>
            </TouchableOpacity>
          </View>
        </>
      ) : (
        <>
          <Text style={styles.greeting}>Set up your passcode</Text>
          <Animated.View
            style={[styles.codeView, style, {gap: 10, marginVertical: 50}]}>
            {passcodeLength.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.codeEmpty,
                  {
                    backgroundColor:
                      passCode[index] !== undefined
                        ? COLORS.CTA
                        : COLORS.PRIMARY,
                  },

                  {
                    height: 50,
                    width: 50,
                    borderRadius: 60,
                    justifyContent: 'center',
                  },
                ]}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 30,
                    color: 'white',
                  }}>
                  {passCode[index]}
                </Text>
              </View>
            ))}
          </Animated.View>
          <View style={styles.numbersView}>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
              }}>
              {[1, 2, 3].map(number => (
                <CustomButton
                  title={number.toString()}
                  key={number}
                  onPress={() => onSetPasscode(number)}
                />
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
              }}>
              {[4, 5, 6].map(number => (
                <CustomButton
                  title={number.toString()}
                  key={number}
                  onPress={() => onSetPasscode(number)}
                />
              ))}
            </View>
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignSelf: 'center',
              }}>
              {[7, 8, 9].map(number => (
                <CustomButton
                  title={number.toString()}
                  key={number}
                  onPress={() => onSetPasscode(number)}
                />
              ))}
            </View>

            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                alignSelf: 'center',
              }}>
              <CustomButtonWithIcon
                iconName="trash"
                iconSize={26}
                onPress={() => onTrashPasscode()}
              />

              <CustomButton title={'0'} onPress={() => onSetPasscode(0)} />

              <View>
                {passCode.length > 0 ? (
                  <CustomButtonWithIcon
                    iconName="backspace"
                    iconSize={22}
                    onPress={onBackspacePasscode}
                  />
                ) : (
                  <>
                    <CustomButtonWithIcon
                      iconName="backspace"
                      iconSize={22}
                      color="lightgrey"
                    />
                  </>
                )}
              </View>
            </View>
          </View>
        </>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  greeting: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 80,
    alignSelf: 'center',
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 50,
  },
  codeEmpty: {
    height: 45,
    width: 45,
    borderRadius: 60,
    justifyContent: 'center',
  },
  numbersView: {
    marginHorizontal: 80,
    rowGap: 30,
  },
  number: {
    fontSize: 32,
  },
});

export default Page;

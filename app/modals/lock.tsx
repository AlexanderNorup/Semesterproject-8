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
  Platform,
  PixelRatio,
  useWindowDimensions,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {COLORS} from '../Colors';
import Haptics from 'react-native-haptic-feedback';
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
import {
  CustomButtonWithFaceIcon,
  CustomButtonWithIcon,
} from '../CustomButtonWithIcon';

import {scale, verticalScale, moderateScale} from 'react-native-size-matters';

const Page = () => {
  const [code, setCode] = useState<number[]>([]);
  const [passCode, setPasscode] = useState<number[]>([]);
  const [confirmPasscode, setConfirmPasscode] = useState<number[]>([]);
  const [step, setStep] = useState<'set' | 'confirm'>('set');
  const [passcodeConfirmed, setPasscodeConfirmed] = useState(false);
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
        } catch (error) {}
      })();
    }
    if (confirmPasscode.length === 6) {
      if (passCode.join('') === confirmPasscode.join('')) {
        Alert.alert('Passcode set!', passCode.join(' '));
        (async () => {
          try {
            await Keychain.setGenericPassword(
              'Doorlock',
              JSON.stringify(passCode),
            );
            setConfirmPasscode([]);
            resetPasscode();
          } catch (error) {}
        })();
      } else {
        // If passcodes don't match, reset passcodes and prompt user to start over
        Alert.alert('Passcodes do not match', 'Please try again.');
        resetPasscode();
      }
    }
    (async () => {
      try {
        const credentials = await Keychain.getGenericPassword();
        if (credentials) {
          setPasscodeExists(true);
        }
      } catch (error) {}
    })();
  }, [code, passCode, confirmPasscode]);

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
                  });
              })
              .catch((error: any) => {});
          },
        },
      ],
    );
  };

  const onSetPasscode = (number: number) => {
    Haptics.trigger('impactMedium');
    if (step === 'set') {
      // If in passcode setting step, update passcode
      if (passCode.length < 6) {
        setPasscode([...passCode, number]);
      }
      if (passCode.length === 5) {
        // If passcode is complete, move to confirmation step
        setStep('confirm');
      }
    } else {
      // If in passcode confirmation step, update confirm passcode
      if (confirmPasscode.length < 6) {
        setConfirmPasscode([...confirmPasscode, number]);
      }
    }
  };

  const onBackspacePasscode = () => {
    Haptics.trigger('impactMedium');
    //setPasscode(passCode.slice(0, -1));
    if (step === 'set') {
      // If in passcode setting step, delete from passcode
      setPasscode(passCode.slice(0, -1));
    } else {
      // If in passcode confirmation step, delete from confirm passcode
      setConfirmPasscode(confirmPasscode.slice(0, -1));
    }
  };

  const resetPasscode = () => {
    setPasscode([]);
    setConfirmPasscode([]);
    setStep('set');
  };

  const handleConfirmation = () => {
    if (passCode.join('') === confirmPasscode.join('')) {
      return true;
    } else {
      // If passcodes don't match, reset passcodes and prompt user to start over
      Alert.alert('Passcodes do not match', 'Please try again.');
      resetPasscode();
      return false;
    }
  };

  const onTrashPasscode = () => {
    Haptics.trigger('impactMedium');
    //setPasscode([]);
    if (step === 'set') {
      // If in passcode setting step, delete from passcode
      setPasscode([]);
    } else {
      // If in passcode confirmation step, delete from confirm passcode
      setConfirmPasscode([]);
    }
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
    fallbackLabel: '', // iOS (if empty, then label is hidden)
    unifiedErrors: false, // use unified error messages (default false)
    passcodeFallback: true, // iOS - allows the device to fall back to using the passcode, if faceid/touch is not available. this does not mean that if touchid/faceid fails the first few times it will revert to passcode, rather that if the former are not enrolled, then it will use the passcode.
  };

  const onBiometricPress = () => {
    TouchID.authenticate('Authenticate to unlock the app', optionalConfigObject)
      .then((success: any) => {
        navigation.navigate('MainApp' as never);
        setCode([]);
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
              {Platform.OS === 'ios' ? (
                <CustomButtonWithFaceIcon
                  iconName="face-id"
                  iconSize={44}
                  onPress={onBiometricPress}
                />
              ) : (
                <CustomButtonWithIcon
                  iconName="fingerprint"
                  iconSize={34}
                  onPress={onBiometricPress}
                  color="black"
                />
              )}
              <CustomButton
                title="0"
                onPress={() => onNumberPress(Number.parseInt('0'))}
              />

              <View>
                {code.length > 0 ? (
                  <CustomButtonWithIcon
                    iconName="backspace"
                    iconSize={30}
                    onPress={onBackspace}
                    color="black"
                  />
                ) : (
                  <CustomButtonWithIcon
                    iconName="backspace"
                    iconSize={30}
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
          {/* <Text style={styles.greeting}>Set up your passcode</Text> */}
          <Text style={styles.greeting}>
            {step === 'set' ? 'Set Passcode' : 'Confirm Passcode'}
          </Text>
          <Animated.View style={[styles.codeView, style]}>
            {passcodeLength.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.codeEmpty,
                  {
                    backgroundColor: (
                      step === 'set'
                        ? passCode[index] !== undefined
                        : confirmPasscode[index] !== undefined
                    )
                      ? COLORS.CTA
                      : COLORS.PRIMARY,
                  },
                ]}>
                <Text
                  style={{
                    alignSelf: 'center',
                    fontSize: 30,
                    color: 'white',
                  }}>
                  {step === 'set' ? passCode[index] : confirmPasscode[index]}
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
                iconSize={30}
                onPress={() => onTrashPasscode()}
                color="black"
              />

              <CustomButton title={'0'} onPress={() => onSetPasscode(0)} />

              <View>
                {passCode.length > 0 ? (
                  <CustomButtonWithIcon
                    iconName="backspace"
                    iconSize={30}
                    onPress={onBackspacePasscode}
                    color="black"
                  />
                ) : (
                  <>
                    <CustomButtonWithIcon
                      iconName="backspace"
                      iconSize={30}
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
    color: 'black',
  },
  codeView: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 10,
    marginVertical: 50,
  },
  codeEmpty: {
    height: 50,
    width: 50,
    borderRadius: 60,
    justifyContent: 'center',
  },
  numbersView: {
    marginHorizontal: 80,
    rowGap: 20,
  },
  number: {
    fontSize: 32,
  },
});

export default Page;

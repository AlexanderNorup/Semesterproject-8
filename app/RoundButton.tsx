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
// AnimationName is just an example and should be replaced by real animation. For Instance FadeIn
import Animated, {
  BounceIn,
  BounceInUp,
  Easing,
  PinwheelIn,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const AnimatedTouchableOpacity =
  Animated.createAnimatedComponent(TouchableOpacity);

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
}) => {
  const rotation = useSharedValue(0);
  const rippleScale = useSharedValue(0);

  const spinAnimation = () => {
    rotation.value = withTiming(0, {duration: 0}); // Reset rotation to 0 degrees
    rotation.value = withTiming(360, {
      duration: 600,
      easing: Easing.out(Easing.ease),
    });
  };

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{rotate: `${rotation.value}deg`}],
    };
  });

  const rippleAnimation = () => {
    rippleScale.value = 0; // Reset scale to 0
    rippleScale.value = withTiming(1, {
      duration: 500,
      easing: Easing.in(Easing.ease),
    });
  };

  const rippleStyle = useAnimatedStyle(() => {
    return {
      transform: [{scale: rippleScale.value}],
      opacity: 1 - rippleScale.value,
    };
  });

  return (
    <SafeAreaView>
      <AnimatedTouchableOpacity
        entering={PinwheelIn.duration(1000)}
        onPress={() => {
          onPress();
          spinAnimation();
          rippleAnimation();
        }}
        style={styles.buttonContainer}>
        <Animated.View
          style={[
            styles.button,
            isOpen ? styles.openButton : {},
            animatedStyle,
          ]}>
          <Text
            style={[styles.buttonTitle, isOpen ? styles.openButtonTitle : {}]}>
            {title}
          </Text>
          <Icon
            name={icon}
            style={[styles.icon, isOpen ? styles.openIcon : {}]}
          />
          {/* Ripple effect */}
          <Animated.View
            style={[
              styles.ripple,
              isOpen ? styles.openRipple : {},
              rippleStyle,
            ]}
          />
        </Animated.View>
      </AnimatedTouchableOpacity>
    </SafeAreaView>
  );
};

// export const RoundButton = ({
//   onPress,
//   title,
//   icon,
//   isOpen,
// }: {
//   onPress: any;
//   title: string;
//   icon: string;
//   isOpen: Boolean;
// }) => (
//   <SafeAreaView>
//     <AnimatedTouchableOpacity
//       onPress={() => {
//         onPress();
//         animationHandler();
//       }}
//       entering={PinwheelIn.duration(1000)}
//       style={isOpen ? styles.openButton : styles.button}>
//       <Text style={isOpen ? styles.openButtonTitle : styles.buttonTitle}>
//         {title}
//       </Text>
//       <Icon name={icon} style={isOpen ? styles.openIcon : styles.icon} />
//     </AnimatedTouchableOpacity>
//   </SafeAreaView>
// );

const animationHandler = () => {
  // Spin the button
};

const BUTTON_SIZE = scale(155);

const styles = StyleSheet.create({
  buttonContainer: {
    alignItems: 'center',
  },
  buttonTitle: {
    fontSize: scale(35),
    fontWeight: '500',
    color: COLORS.DOOR_RED,
  },
  openButtonTitle: {
    fontSize: scale(35),
    fontWeight: '500',
    color: COLORS.DOOR_GREEN,
  },
  button: {
    borderWidth: scale(8),
    borderColor: COLORS.DOOR_RED,
    alignItems: 'center',
    justifyContent: 'center',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: 'rgba(0,0,0,0.001)',
    borderRadius: 100,
  },
  icon: {
    fontSize: scale(30),
    color: COLORS.DOOR_RED,
  },
  openButton: {
    borderWidth: scale(8),
    borderColor: COLORS.DOOR_GREEN,
    alignItems: 'center',
    justifyContent: 'center',
    width: BUTTON_SIZE,
    height: BUTTON_SIZE,
    backgroundColor: 'rgba(0,0,0,0.001)',
    borderRadius: 100,
  },
  openIcon: {
    fontSize: scale(30),
    color: COLORS.DOOR_GREEN,
  },
  ripple: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: COLORS.DOOR_RED,
    borderRadius: BUTTON_SIZE / 2,
    zIndex: -1,
  },
  openRipple: {
    backgroundColor: COLORS.DOOR_GREEN,
  },
});

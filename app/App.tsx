/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import React, {useState} from 'react';
import type {PropsWithChildren} from 'react';
import {
  ImageBackground,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import {
  Colors,
  DebugInstructions,
  Header,
  LearnMoreLinks,
  ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import {RoundButton} from './RoundButton';
import {COLORS} from './Colors';
import BackgroundAnimation from './BackgroundAnimation';

type SectionProps = PropsWithChildren<{
  title: string;
}>;

function Section({children, title}: SectionProps): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  return (
    <View style={styles.sectionContainer}>
      <Text
        style={[
          styles.sectionTitle,
          {
            color: isDarkMode ? Colors.white : Colors.black,
          },
        ]}>
        {title}
      </Text>
      <Text>{children}</Text>
    </View>
  );
}

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  var isOpen: boolean = false;
  var doorText: string = 'Open';
  var statusOfDoor: string = ' ';
  const [buttonState, setButtonState] = useState(isOpen);

  switch (buttonState) {
    case false:
      doorText = 'Open';
      statusOfDoor = 'Locked';
      isOpen = true;
      break;
    case true:
      doorText = 'Lock';
      statusOfDoor = 'Opened';
      isOpen = false;
      break;
    default:
      break;
  }

  const backgroundStyle = {
    backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
  };

  const statusStyle = {
    statusColor: isOpen ? COLORS.GREEN : COLORS.RED,
  };

  const onlineImage = {uri: 'https://i.giphy.com/pOLspHmrKmQmc.webp'};
  const localImage = require('./assets/spin.gif');

  return (
    <ImageBackground
      source={localImage}
      resizeMode="cover"
      style={styles.image}>
      <View style={styles.container}>
        <Section title="Status of door:">
          <Text style={isOpen ? styles.highlightG : styles.highlightR}>
            {statusOfDoor}
          </Text>
        </Section>
        <View style={styles.screenContainer}>
          <View style={styles.buttonStyleContainer}>
            <RoundButton
              title="Open"
              icon="lock-open"
              onPress={() => setButtonState(true)}
            />
            <RoundButton
              title="Lock"
              icon="lock"
              onPress={() => setButtonState(false)}
            />
          </View>
        </View>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
  },
  screenContainer: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyleContainer: {
    flex: 1,
    columnGap: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightR: {
    fontWeight: '900',
    fontSize: 30,
    color: COLORS.RED,
    textShadowColor: '#585858',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  highlightG: {
    fontWeight: '900',
    fontSize: 30,
    color: COLORS.GREEN,
    textShadowColor: '#585858',
    textShadowOffset: {width: 1, height: 1},
    textShadowRadius: 2,
  },
  image: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default App;

/**
 * @format
 */

import {AppRegistry} from 'react-native';
import App from './App';
import layout from './app/_layout';
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => layout);

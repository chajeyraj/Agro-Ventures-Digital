import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import { enableScreens } from 'react-native-screens';
import App from './App';

// Enable screens for better performance and compatibility
enableScreens();

// Register the root component
registerRootComponent(App);

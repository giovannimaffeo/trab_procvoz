import { AppRegistry, View, Text } from 'react-native';

import Routes from "./src/routes";
import SignInScreen from "./src/screens/SignInScreen";

export default function App() {
  return (
    <View><Text>oi</Text></View>
  );
};

AppRegistry.registerComponent('MyApp', () => App); // 'MyApp' é o nome do seu aplicativo

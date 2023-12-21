import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import ListPage from './screens/listView';
import DetailPage from './screens/detailView';


export default function App() {
  const Stack = createNativeStackNavigator();


  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName='ListPage'>
        <Stack.Screen
          name='ListPage'
          component={ListPage}
        />
        <Stack.Screen
          name='DetailPage'
          component={DetailPage}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
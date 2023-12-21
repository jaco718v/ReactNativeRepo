import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function App() {
  return (
    <View style={styles.container}>
      <Image source = {{uri:'https://jobbank.dk/images/dynamic/company/logo/32529/',}}
       style = {{width:200, height: 150}}/>
       <View style={styles.container1}>
      <Text >Med rettidig omhu</Text>
      </View>
      <StatusBar style="auto"/>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8f9ff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  container1: {
    backgroundColor: '#87CEEB',
    alignItems: 'center',
    justifyContent: 'center',
    width: 150,
    height: 30,
    borderRadius: 15,
  },
});

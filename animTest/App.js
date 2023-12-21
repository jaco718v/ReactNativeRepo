import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import { PanGestureHandler, GestureHandlerRootView } from 'react-native-gesture-handler'
import Animated, {useSharedValue, useAnimatedGestureHandler, useAnimatedStyle, withSpring} from 'react-native-reanimated'


export default function App() {
  const translateX = useSharedValue(0)
  const translateY = useSharedValue(0)

  const onGestureEvent = useAnimatedGestureHandler({
    onStart:(_,context) =>{ 
      console.log("Noget" + translateX.value)
    }
  })


  return (
    <GestureHandlerRootView style={styles.rootView}>
      <View style={styles.container}>
        <PanGestureHandler onGestureEvent={onGestureEvent}>
          <Animated.View>
            <Text> Drag and watch console log</Text>
          </Animated.View>
        </PanGestureHandler>
        <StatusBar style="auto" />
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  rootView:{
    flex: 1
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

import { useContext } from "react";
import { StyleSheet, View,  Text } from "react-native";
import { StatusContext } from "./myContext";  

export default function  Page2({navigation}){
  const statusContext = useContext(StatusContext)
  return ( 
    <View style={styles.container}>
        {statusContext.currentUser &&
        <>
         <Text>Du er logget på</Text>
         <Text>{statusContext.currentUser.uid}</Text>
         </>
         }
          {!statusContext.currentUser &&
         <Text>Du er ikke logget på</Text>}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
  flex: 1,
  backgroundColor: '#fff',
  alignItems: 'center',
  justifyContent: 'center',
  },
  });
  
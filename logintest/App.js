import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Platform } from 'react-native';
import axios from 'axios'
import { useState, useEffect } from 'react';
import { db, app } from './components/config';
import { addDoc, collection } from 'firebase/firestore';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut, createUserWithEmailAndPassword } from 'firebase/auth'
import { initializeAuth, getReactNativePersistence } from 'firebase/auth'
import  ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

//web

//device / emulator
let auth
if(Platform.OS === 'web'){
  auth = getAuth(app)
}else{
  auth = initializeAuth(auth, {
    persistence:getReactNativePersistence(ReactNativeAsyncStorage)
  })
}

//const auth = getAuth(app)

export default function App() {
  // const API_KEY = 'AIzaSyA4SULttGJVoLt0gWSrJXvDdd1oKI-gTgo'
  // const url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key='
  // const urlSignUp = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key='
  const [enteredEmail, setEnteredEmail] = useState("jacobankerm@gmail.com")
  const [enteredPassword, setEnteredPassword] = useState("123test")
  const [userId, setUserId] = useState(null)
  const [enteredText, setEnteredText] = useState("Type here")

  useEffect(()=>{
    const auth_ = getAuth()
    const unsubscribe = onAuthStateChanged(auth_, (currentUser) => {
      if(currentUser){
        setUserId(currentUser.uid)
      }else{
        setUserId(null)
      }
    })
    return () => unsubscribe() // Kaldes når app unmountes/lukkes
  },[])

  async function signOut_(){
    await signOut(auth)
  }
 
 
  async function login(){
    try{
      const userCredential = await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
      console.log('Logged in' + userCredential.user.uid)
    }catch(error){
      console.log(error)
    }
  }

  async function signUp(){
    try{
      const userCredential = await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword)
      console.log("sign up succes " + userCredential.user.uid)
    }catch(error){

    }
  //   try{
  //     const response = await axios.post(urlSignUp+API_KEY, {
  //       email:enteredEmail,
  //       password:enteredPassword,
  //       returnSecureToken:true
  //     })
  //     console.log("Oprettet" + response.data.localId)
  //   }catch(error){
  //     alert("Ikke oprettet" + error.response.data.error.errors[0].message)
  //   }
  }
  
  async function addDocument(){
    try{
      await addDoc(collection(db,userId),{
        text:enteredText
      })
    }catch(error){
      console.log("error addDocument" + error)
    }
  }

  return (
    <View style={styles.container}>
      { !userId &&
        <>
      <Text>Login</Text>

      <TextInput
      onChangeText={newText => setEnteredEmail(newText)}
      value = {enteredEmail}
      />

      <TextInput
      onChangeText={newText => setEnteredPassword(newText)}
      value={enteredPassword}
      />

      <Button
      title='Login'
      onPress={login}
      />
      
      <Button
      title='Sign Up'
      onPress={signUp}
      />

      </>}
      { userId &&
      <>
      <TextInput
      onChangeText={newText => setEnteredText(newText)}
      value={enteredText}
      />


      
      <Button
      title='Add Document'
      onPress={addDocument}
      />


      <Button
      title='Sign out'
      onPress={signOut_}
      />
    </>}

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

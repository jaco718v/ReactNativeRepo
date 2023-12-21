import { storage, db } from '../components/config';
import { StatusBar } from 'expo-status-bar';
import { Button, StyleSheet, TextInput, View, Image } from 'react-native';
import { useState } from 'react' ;
import { ref, uploadBytes, getDownloadURL, deleteObject} from "firebase/storage"
import { updateDoc, doc } from 'firebase/firestore';
import * as ImagePicker from "expo-image-picker"

const DetailPage = ({navigation, route}) => {
    const noteData = route.params?.noteData 
    const saveData = {id:noteData.id, title:noteData.title, hasImage: noteData.hasImage}
    const [imagePath, setImagePath] = useState(null)
    const [newImageFlag, setImageFlag] = useState(false)
    if(saveData.hasImage && !newImageFlag){
      downloadImage()
    }
  
    async function updateNote(){
        if(!saveData.text){
          saveData.text = ""
        }
        await updateDoc(doc(db, "notes", String(saveData.id)), {
          title: saveData.title,
          text: saveData.text
        })
      }

    async function launchImagePicker(){
      let result = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true
      })
      if(!result.canceled){
        setImagePath(result.assets[0].uri)
        setImageFlag(true)
      }
    }
  
    async function launchCamera(){
      const result = await ImagePicker.requestCameraPermissionsAsync()
      if(result.granted===false){
        alert("Missing camera access permission")
      } else {
        ImagePicker.launchCameraAsync({
          quality: 1
        })
        .then((response) => {
          if(!response.canceled){
            setImagePath(response.assets[0].uri)
          }
        })
        .catch((error) => console.log("Camera error: " + error))
    }
  }

    async function deletePrevImg(){
      const delRef = ref(storage, `imageFor${noteData.id}.jpg`)
      await deleteObject(delRef).then(() => {
      }).catch((error) => {
        console.log(error)
      })
    }
  
    async function uploadImage(){
      await deletePrevImg()
      const res = await fetch(imagePath)
      const blob = await res.blob()
      const storageRef = ref(storage,`imageFor${noteData.id}.jpg`)
      uploadBytes(storageRef, blob).then((snapshot) => {
      console.log("image uploaded")
      })
    }
  
    async function downloadImage(){
      getDownloadURL(ref(storage, `imageFor${noteData.id}.jpg`))
      .then((url) => {setImagePath(url)
      }).catch((error) => {
        console.log("fejl i image dowload " + error)
      })
  
    }
  
    return (
      <View style={styles.container}>
  
        <TextInput 
          defaultValue={noteData.title}
          style={styles.textInputTitle}
          onChangeText={(title) => saveData.title = title}
          placeholder='Note title'/>
  
        <TextInput 
          multiline
          defaultValue={noteData.text}
          style={styles.textInput}
          onChangeText={(txt) => saveData.text = txt}
          placeholder='Write notes here'/>
  
        <View style={styles.imageContainer} >
          <Image style={styles.image} source={{uri:imagePath}}/>
        </View>
  
        <Button
          color={"grey"}
          title='Pick image'
          onPress={() => {
            if (confirm("Use Camera?") == true) {
              launchCamera()
            } else {
              launchImagePicker()
            }
          }}
        />
  
        <Button
          color={"black"}
          title='Save'
          onPress={()=>{
            if(newImageFlag){
              uploadImage()
              saveData.hasImage=true
            }
            updateNote()
            }}
        />
        </View>
  )
  }

  export default DetailPage

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fffd74',
    },
    textInput:{
       backgroundColor: '#fffd74',
       maxWidth:"100%",
       height: "100%",
       padding: 5,
       },  
    textInputTitle:{
       backgroundColor: '#fffd74',
       padding: 5,
       borderBottomColor: "black",
       borderBottomWidth: 1
       },
    image:{
      width:200,
      height:200,
      marginBottom: 10
    },
    imageContainer:{
      justifyContent:"center",
      alignItems: "center",
    }
     });
import { doc, setDoc, collection, updateDoc, deleteDoc, onSnapshot, query } from "firebase/firestore";
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, FlatList, TouchableOpacity } from 'react-native';
import { useState } from 'react' ;  
import { db } from '../components/config'


let isDataLoaded = false

const ListPage = ({navigation, route}) => {
    const [list, editList] = useState([])
    const [deleteFlag, setFlag] = useState(false);
    
    if(!isDataLoaded){    
        isDataLoaded = true
        loadNotes()

    } 

    function findNextId(){
      if(list.length===0){
        return 0
        }
      const highestId = Math.max(...list.map(n => Number(n.id)))
      return (highestId+1)
    }
  
    async function loadNotes(){
        const collectionRef = collection(db, "notes")
        const q = query(collectionRef, ref => ref.orderBy('createdAt', 'desc'));
        onSnapshot(q, snapshot =>{ 
        const loadedNotes = []
        snapshot.forEach(doc => {
          loadedNotes.push({id: doc.id, ...doc.data()}) 
        })
        editList([...loadedNotes])
      })
    }   
  
    async function createNote(data){
      await setDoc(doc(db, "notes", String(data.id)), {
        title: data.title,
        hasImage: data.hasImage
      })
    }
  
    async function deleteNote(dataId){
      await deleteDoc(doc(db, "notes", String(dataId)))
      const filteredArr = list.filter(n => n.id != dataId)
      editList([...filteredArr])
    }
      
    return (  
      <View style={styles.container}>
        <View style={styles.buttons}> 
          <TouchableOpacity 
            style={deleteFlag ? styles.buttonInactive : styles.buttonActive}
            title='Delete'
            onPress={() => {setFlag(!deleteFlag)}}> 
            <Text style={styles.backgroundText}>Delete</Text>     
          </TouchableOpacity> 
        <TouchableOpacity
        color="black"
         title='+'
         style={styles.buttonActive}
          onPress={() =>{ 
            const nextId = findNextId()
            const newNote = {id:nextId, title: `Unnamed note ${nextId}`, hasImage:false}
            createNote(newNote)
           }}>
            <Text style={styles.backgroundText}>+</Text>
          </TouchableOpacity>
        </View>
  
        <FlatList
        data={list}
        renderItem={(note) => <Text style={styles.noteListItem} title='test' onPress={()=>{
          if(deleteFlag){
            deleteNote(note.item.id)
            setFlag(false)
          } else{
            navigation.navigate("DetailPage", {noteData: note.item})}}}>{note.item.title}</Text>}
        />
        <StatusBar style="auto" />
      </View>
    );
  }
  
  
  export default ListPage

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fffd74',
    },
    noteListItem:{
      width: '100%',
      padding: 2,
      borderTopColor: "black",
      borderTopWidth: 1,
      paddingLeft: 10,
      },
    buttons:{
      flexDirection: 'row',
    },
    buttonInactive:{
      backgroundColor: 'black',
      padding: 5,
      width: 180
    },
    buttonActive:{
      backgroundColor: 'grey',
      padding: 5,
      width: 180
    },
    backgroundText:{
      color:"white"
    }
     });

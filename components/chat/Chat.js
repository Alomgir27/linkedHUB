import React, {
   useState, 
   useEffect,
  useCallback,
    useRef
} from 'react'
import { 
    View, 
    Text, 
    StyleSheet, 
    TextInput, 
    TouchableOpacity, 
    Image, 
    KeyboardAvoidingView, 
    Alert, 
    ImageBackground , 
    Dimensions, 
    Button, 
    Keyboard, 
    Animated
} from 'react-native'

import { MaterialCommunityIcons } from 'react-native-vector-icons';
import { GiftedChat, Bubble } from 'react-native-gifted-chat'
import { Video, Audio } from 'expo-av';

import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { MaterialIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { Ionicons } from '@expo/vector-icons';
import { Feather } from '@expo/vector-icons';



import { Send } from 'react-native-gifted-chat';
import { CustomActions } from 'react-native-gifted-chat';
import { Actions } from 'react-native-gifted-chat';
import { InputToolbar } from 'react-native-gifted-chat';
import { Composer } from 'react-native-gifted-chat';
import { Time } from 'react-native-gifted-chat';
import { Day } from 'react-native-gifted-chat';

import AudioPlayer from 'react-native-play-audio';

import { Appbar } from 'react-native-paper';






import { ActivityIndicator } from 'react-native-paper';





import uuid from 'react-native-uuid';

import {
  db,
  auth,
  fs,
} from '../../firebase';

import firebase from 'firebase/app';

import * as ImagePicker from 'expo-image-picker';

function Chat({ navigation }) {
  const [messages, setMessages] = useState([]);
  const [user, setUser] = useState(null);
  const [image, setImage] = useState(null);
  const [video, setVideo] = useState(null);
  const [audio, setAudio] = useState(null);
  const [text, setText] = useState('');
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  const [progress, setProgress] = useState(0);

  
  
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        setUser(user);
      } else {
        navigation.navigate('Login');
      }
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const unsubscribe = db
      .collection('messages')
      .orderBy('createdAt', 'desc')
      .onSnapshot((querySnapshot) => {
        const messagesFirestore = querySnapshot
          .docChanges()
          .filter(({ type }) => type === 'added')
          .map(({ doc }) => {
            const message = doc.data();
            return { ...message, createdAt: message.createdAt.toDate() };
          })
          .reverse();
        appendMessages(messagesFirestore);
      });
    return () => unsubscribe();
  }, []);

  const appendMessages = useCallback(
    (messages) => {
      setMessages((previousMessages) => GiftedChat.append(previousMessages, messages));
    },
    [messages]
  );

  const handleSend = async (messages) => {
    const writes = messages.map((m) => db.collection('messages').add(m));
    await Promise.all(writes);
  };

  const handlePickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  }

  const handlePickVideo = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setVideo(result.assets[0].uri);
    }
  }

  const handlePickAudio = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Audio,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setAudio(result.assets[0].uri);
    }
  }

  const handleUploadImage = async () => {
    const uri = image;
    const childPath = `post/${
      auth.currentUser.uid
    }/${uuid.v4()}`;
    setUploading(true);
    setProgress(0);

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = fs.ref().child(childPath).put(blob);

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        setUploading(false);
        setImage(null);
      });
    };

    const taskError = snapshot => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  }

  const handleUploadVideo = async () => {
    const uri = video;
    const childPath = `post/${
      auth.currentUser.uid
    }/${uuid.v4()}`;
    setUploading(true);
    setProgress(0);

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = fs.ref().child(childPath).put(blob);

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        setUploading(false);
        setVideo(null);
      });
    };

    const taskError = snapshot => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  }

  const handleUploadAudio = async () => {
    const uri = audio;
    const childPath = `post/${
      auth.currentUser.uid
    }/${uuid.v4()}`;
    setUploading(true);
    setProgress(0);

    const response = await fetch(uri);
    const blob = await response.blob();

    const task = fs.ref().child(childPath).put(blob);

    const taskCompleted = () => {
      task.snapshot.ref.getDownloadURL().then((snapshot) => {
        savePostData(snapshot);
        setUploading(false);
        setAudio(null);
      });
    };

    const taskError = snapshot => {
      console.log(snapshot);
    };

    task.on('state_changed', taskProgress, taskError, taskCompleted);
  }

  const taskProgress = snapshot => {
    setProgress((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
  }

  const savePostData = downloadURL => {
    db.collection('messages').add({
      text: text,
      uid: auth.currentUser.uid,
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      image: downloadURL,
    });
  }

  const renderSend = (props) => {
    return (
      <Send {...props}>
        <View style={styles.sendingContainer}>
          <MaterialCommunityIcons name="send-circle" size={32} color="#2e64e5" />
        </View>
      </Send>
    );
  }

  const renderInputToolbar = (props) => {
    if(loading) return <ActivityIndicator size="large" color="#2e64e5" />
    return (
      <InputToolbar {...props} />
    );
  }


  const renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: '#2e64e5',
          },
        }}
        textStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  }

  const renderComposer = (props) => {
    return (
      <Composer
        {...props}
        textInputStyle={{
          color: '#2e64e5',
          backgroundColor: '#fff',
          borderRadius: 30,
          borderWidth: 1,
          borderColor: '#2e64e5',
          padding: 10,
          marginBottom: 10,
        }}
        placeholder="Type a message..."
        placeholderTextColor="#2e64e5"
      />
    );
  }

  const renderTime = (props) => {
    return (
      <Time
        {...props}
        timeTextStyle={{
          right: {
            color: '#fff',
          },
        }}
      />
    );
  }

  const renderDay = (props) => {
    return (
      <Day
        {...props}
        textStyle={{
          color: '#2e64e5',
        }}
      />
    );
  }

  const renderLoading = () => {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2e64e5" />
      </View>
    );
  }

  const renderCustomActions = (props) => {
    return <CustomActions {...props} />;
  }

  const scrollToBottomComponent = () => {
    return (
      <View style={styles.bottomComponentContainer}>
        <Ionicons name="chevron-down" size={24} color="#2e64e5" />
      </View>
    );
  }

  const pickDocument = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (status === 'granted') {
      let result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        const fileToSend = {
          name: result.name,
          uri: result.uri,
        };

        db.collection('messages').add({
          uid: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          file: fileToSend,
        });
      }
    }
  }

  

  const pickContact = async () => {
    const { status } = await Permissions.askAsync(Permissions.CONTACTS);

    if (status === 'granted') {
      const contact = await Contacts.getContactsAsync({
        fields: [Contacts.Fields.PhoneNumbers],
      });

      if (contact.length > 0) {
        const contactToSend = {
          name: contact[0].name,
          phone: contact[0].phoneNumbers[0].number,
        };
        
        db.collection('messages').add({
          uid: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          contact: contactToSend,
        });
      }
    }
  }

  const pickFile = async () => {
    const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);

    if (status === 'granted') {
      let result = await DocumentPicker.getDocumentAsync({});
      if (result.type === 'success') {
        const file = {
          uri: result.uri,
          name: result.name,
          type: result.type,
        };
        db.collection('messages').add({
          uid: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          file: file,
        });
      }
    }
  }


  const pickLocation = async () => {
    const { status } = await Permissions.askAsync(Permissions.LOCATION);
    
    if (status === 'granted') {
      let result = await Location.getCurrentPositionAsync({});
      if (result) {
        const location = JSON.stringify(result);
        db.collection('messages').add({
          uid: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          location: location,
        });
      }
    }
  }

  const takePicture = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);

    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
      }).catch(error => console.log(error));
      
      if (!result.cancelled) {
        const imageUrl = await uploadImageFetch(result.uri);
        db.collection('messages').add({
          uid: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          image: imageUrl,
        });
      }
    }
  }


  const takeVideo = async () => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL, Permissions.CAMERA);

    if (status === 'granted') {
      let result = await ImagePicker.launchCameraAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      }).catch(error => console.log(error));
      
      if (!result.cancelled) {
        const videoUrl = await uploadVideoFetch(result.uri);
        db.collection('messages').add({
          uid: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          video: videoUrl,
        });

      }
    }
  }

  const takeAudio = async () => {
    const { status } = await Permissions.askAsync(Permissions.AUDIO_RECORDING);

    if (status === 'granted') {
      const recording = new Audio.Recording();
      try {
        await recording.prepareToRecordAsync(Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY);
        await recording.startAsync();
        // You are now recording!
      } catch (error) {
        // An error occurred!
      }

      setTimeout(async () => {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        const audioUrl = await uploadAudioFetch(uri);
        db.collection('messages').add({
          uid: auth.currentUser.uid,
          timestamp: firebase.firestore.FieldValue.serverTimestamp(),
          audio: audioUrl,
        });
      }, 5000);
    }

  }

  const uploadImageFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = firebase.storage().ref().child(new Date().toISOString());
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  const uploadVideoFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });
    
    const ref = firebase.storage().ref().child(new Date().toISOString());
    const snapshot = await ref.put(blob);
  
    blob.close();

    return await snapshot.ref.getDownloadURL();
  }

  const uploadAudioFetch = async (uri) => {
    const blob = await new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest();
      xhr.onload = function() {
        resolve(xhr.response);
      };
      xhr.onerror = function(e) {
        console.log(e);
        reject(new TypeError('Network request failed'));
      };
      xhr.responseType = 'blob';
      xhr.open('GET', uri, true);
      xhr.send(null);
    });

    const ref = firebase.storage().ref().child(new Date().toISOString());
    const snapshot = await ref.put(blob);

    blob.close();

    return await snapshot.ref.getDownloadURL();
  }
  


  const renderActions = (props) => {
    return (
      <Actions
        {...props}
        containerStyle={{
          width: 44,
          height: 44,
          alignItems: 'center',
          justifyContent: 'center',
          marginLeft: 4,
          marginRight: 4,
          marginBottom: 0,

        }}
        icon={() => (
          <Ionicons name="ios-add-circle" size={32} color="#2e64e5" />
        )}
        options={{
          ['Choose From Library']: () => { pickDocument() },
          ['Send location']: () => { pickLocation() },
          ['Take Picture']: () => { takePicture() },
          ['Take Video']: () => { takeVideo() },
          ['Take Audio']: () => { takeAudio() },
          ['Send file']: () => { pickFile() },
          ['Send contact']: () => { pickContact() },
          Cancel: () => {},
        }}
        optionTintColor="#2e64e5"
      />
    );
  } 

  const renderCustomView = (props) => {
    const { currentMessage } = props;
    if (currentMessage.image) {
      return (
        <View>
          <Image
            source={{ uri: currentMessage.image }}
            style={{ width: 200, height: 200 }}
            resizeMode="cover"
          />
        </View>
      );
    }
    return null;
  } 





  return (
    <View style={{ flex: 1 }}>
      <Appbar.Header style={{ backgroundColor: '#fff' }}>
        <Appbar.BackAction onPress={() => navigation.goBack()} />
        <Appbar.Content title="Chat" />
        <Appbar.Action icon="video" size={24} onPress={() => Alert.alert('Video call', 'Coming soon...')} />
        <Appbar.Action icon="phone" size={24} onPress={() => Alert.alert('Audio call', 'Coming soon...')} />
        <Appbar.Action icon="dots-vertical" size={24}  onPress={() => Alert.alert('More', 'Coming soon...')} />
      </Appbar.Header>
      
      <GiftedChat
        messages={messages}
        onSend={handleSend}
        user={{ _id: auth.currentUser.uid }}
        renderBubble={renderBubble}
        renderInputToolbar={renderInputToolbar}
        scrollToBottom
        scrollToBottomComponent={scrollToBottomComponent}
        renderActions={renderActions}
        renderCustomView={renderCustomView}
        renderSend={renderSend}
        renderComposer={renderComposer}
        renderTime={renderTime}
        renderDay={renderDay}
        renderLoading={renderLoading}
        renderCustomActions={renderCustomActions}

      />
      {image ? (
        <View style={styles.imageContainer}>
          <Image source={{ uri: image }} style={styles.imageBox} />
          <TouchableOpacity onPress={handleUploadImage} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setImage(null)} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {video ? (
        <View style={styles.imageContainer}>
          <Video
            source={{ uri: video }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="cover"
            shouldPlay
            isLooping
            style={styles.imageBox}
          />
          <TouchableOpacity onPress={handleUploadVideo} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setVideo(null)} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {audio ? (
        <View style={styles.imageContainer}>
          <AudioPlayer
            audio={audio}
          />
          <TouchableOpacity onPress={handleUploadAudio} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setAudio(null)} style={styles.imageButton}>
            <Text style={styles.imageButtonText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      ) : null}
      {uploading ? (
        <View style={styles.imageContainer}>
          <Text style={styles.imageButtonText}>{progress}%</Text>
          {progress != 100 ? (
            <ActivityIndicator size="large" color="#0000ff" />
          ) : null}
        </View>
      ) : (
        <View style={styles.imageContainer}></View>
      )}
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
  imageContainer: {
    backgroundColor: '#fff',
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageBox: {
    width: 200,
    height: 200,
    margin: 5,
  },
  imageButton: {
    width: 100,
    height: 50,
    backgroundColor: '#2e64e5',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 5,
  },
  imageButtonText: {
    color: '#fff',
    fontSize: 20,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomComponentContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
 

});

export default Chat;
  
          
  
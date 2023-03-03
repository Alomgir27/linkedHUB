import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';
import firebase from '../../firebase'
import axios from 'axios';

import { baseURL } from '../config/baseURL';

import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';

import { modifyStoryState } from '../redux/actions';

export default function StoryFileUploader({ navigation }) {
  const [image, setImage] = useState(null);
  const [uploading, setUploading] = useState(false);

  const user = useSelector((state) => state?.data?.currentUser);
  const usersStory = useSelector((state) => state?.data?.usersStory);

  const dispatch = useDispatch();

  const pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      // aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadImage = async () => {
    setUploading(true);
    const response = await fetch(image);
    const blob = await response.blob();
    const filename = image.split('/').pop();

    const ref = firebase.storage().ref().child(`images/${filename}+${Date.now()}`);

    ref.put(blob).then(async (snapshot) => {
      console.log('Uploaded a blob or file!');
      snapshot.ref.getDownloadURL().then(async (downloadURL) => {
        console.log('File available at', downloadURL);
        const data = {
          imageURL: downloadURL,
          uuid: firebase.auth().currentUser.uid,
          name: user?.name,
          userName: user?.userName,
          profilePic: user?.profilePic,
        };
        await axios.post(`${baseURL}/api/stories/addStory`, data).then((res) => {
          const { story } = res.data;
          let newStories = []
          newStories.push(story)
          dispatch(modifyStoryState(usersStory, newStories, user));
          Alert.alert('Success', 'Story uploaded successfully',
            [
              {
                text: 'OK',
                onPress: () => navigation.goBack(),
              },
            ],
            { cancelable: false }
          );
        })
          .catch((error) => {
            setUploading(false);
            console.log(error);
            Alert.alert('Error', 'Something went wrong',
              [
                {
                  text: 'OK',
                  onPress: () => navigation.goBack(),
                },
              ],
              { cancelable: false }
            );
          });
      });
    });
  };

  if(uploading) return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000', }}>
      <Text style={{ color: '#fff', fontSize: 20, }}>Uploading...</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Ionicons name="arrow-back-outline" size={28} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.title}>Add to Story</Text>
        <TouchableOpacity
          style={[styles.postButton, { opacity: image ? 1 : 0.5 }]}
          onPress={() => uploadImage()}
          disabled={!image}
        >
          <Text style={styles.postButtonText}>Post</Text>
        </TouchableOpacity>
      </View>
      <TouchableOpacity style={styles.imageContainer} onPress={() => pickImage()}>
        {image ? (
          <Image source={{ uri: image }} style={styles.image} />
        ) : (
          <Ionicons name="add-outline" size={50} color="#999" />
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Constants.statusBarHeight + 10,
    paddingBottom: 10,
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 10,
  },
  title: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  postButton: {
    padding: 10,
    backgroundColor: '#0084ff',
    borderRadius: 5,
    opacity: 0.5,
  },
  postButtonText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    flex: 1,
    width: '100%',
    borderRadius: 10,
  },
});

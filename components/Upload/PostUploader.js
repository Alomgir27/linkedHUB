import React, { useState } from 'react';
import { View, Text, TextInput, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import firebase from 'firebase';

const PostUploader = () => {
  const [image, setImage] = useState(null);
  const [caption, setCaption] = useState('');
  const [uploading, setUploading] = useState(false);

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'You need to grant access to your camera roll to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1,
    });

    if (!result.cancelled) {
      setImage(result.uri);
    }
  };

  const uploadPost = async () => {
    if (!image) {
      Alert.alert('Error', 'You need to select an image to upload.');
      return;
    }

    setUploading(true);

    try {
      const response = await fetch(image);
      const blob = await response.blob();
      const ref = firebase.storage().ref().child(`posts/${Math.random().toString(36).substring(2)}`);
      const snapshot = await ref.put(blob);

      const downloadURL = await snapshot.ref.getDownloadURL();

      firebase.firestore().collection('posts').add({
        imageUrl: downloadURL,
        caption,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
      });

      Alert.alert('Success', 'Post uploaded successfully');

      setImage(null);
      setCaption('');
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'An error occurred while uploading your post.');
    }

    setUploading(false);
  };

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200, marginBottom: 20 }} />}
      <TouchableOpacity onPress={pickImage} style={{ padding: 10, backgroundColor: '#ccc', borderRadius: 5, marginBottom: 20 }}>
        <Text>Select Image</Text>
      </TouchableOpacity>
      <TextInput placeholder="Enter caption" value={caption} onChangeText={setCaption} style={{ padding: 10, backgroundColor: '#fff', borderRadius: 5, marginBottom: 20, width: '100%' }} />
      <TouchableOpacity onPress={uploadPost} style={{ padding: 10, backgroundColor: '#007AFF', borderRadius: 5, width: '100%' }}>
        {uploading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={{ color: '#fff', textAlign: 'center' }}>Upload Post</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

export default PostUploader;

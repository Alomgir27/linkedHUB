//This page is for clicking or selecting picture to upload

import React, { useState, useEffect } from "react";
import { StyleSheet, Text, View, TouchableOpacity, Image, SafeAreaView } from "react-native";
import { Camera } from "expo-camera";
import { Button, Colors, IconButton } from "react-native-paper";
import * as ImagePicker from "expo-image-picker";
import { MaterialIcons, FontAwesome, AntDesign } from "@expo/vector-icons";
import styles from "./styles";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import Swiper from 'react-native-swiper';




export default function Add({ navigation }) {
  const [hasCameraPermission, setHasCameraPermission] = useState(null);
  const [hasGalleryPermission, setHasGalleryPermission] = useState(null);
  const [camera, setCamera] = useState(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [flesh, setFlesh] = useState(Camera.Constants.FlashMode.off);
  const [images, setImages] = useState([]);

  useEffect(() => {
    (async () => {
      const cameraStatus = await Camera.requestCameraPermissionsAsync();
      setHasCameraPermission(cameraStatus.status === "granted");
      const galleryStatus =
        await ImagePicker.requestMediaLibraryPermissionsAsync();
      setHasGalleryPermission(galleryStatus.status === "granted");
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const data = await camera.takePictureAsync({
        quality: 0.5,
        base64: true
      });
      setImages([...images, data]);
    }
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'You need to grant access to your camera roll to upload images.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      quality: 0.5,
      allowsMultipleSelection: true,      
    });

    

    if (!result.canceled) {
      console.log(result);
      let images = [];
      result.assets.map((item) => {
        images.push(item)
      });
      setImages(images);
     
    }

  };

  const OpenCam = async () => {
    let result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.5,
    });
    console.log(result);

    if (!result.canceled) {
     setImages([...images, result]);
    }
  };

  if (
    hasCameraPermission === false ||
    hasCameraPermission === null ||
    hasGalleryPermission === false
  ) {
    return (
      <View style={[styles.Camcontainer, { paddingHorizontal: 30 }]}>
        <Text>
          Camera access is denied. Please Go to settings and turn on the camera
          access.
        </Text>
      </View>
    );
  }
  return (
    <SafeAreaView style={{ flex: 1 }}>
      {!images.length && (
        <MaterialCommunityIcons
          name="close"
          size={30}
          color="black"
          style={{ position: "absolute", top: 40, right: 20, zIndex: 1 }}
          onPress={() => {
            setImages([]);
            navigation.goBack();
          }}
        />
      )}
      <View style={styles.Camcontainer}>
        {!images.length ? (
          <Camera
            flashMode={flesh}
            ref={(ref) => setCamera(ref)}
            style={styles.preview}
            type={type}
            autofocus={Camera.Constants.AutoFocus.on}
          />
        ) : (
          <View style={styles.containerImg}>
            <Swiper
              style={styles.wrapper}
              showsButtons={true}
              loop={false}
              showsPagination={false}
            >
              {images.map((image, index) => (
                <View style={styles.slide} key={index}>
                  <Image
                    source={{ uri: image.uri }}
                    style={{ width: "100%", height: "100%" }}
                  />
                </View>
              ))}
            </Swiper>
           
            
            <IconButton
              icon="close"
              color="#fff"
              onPress={() => setImages([])}
              size={30}
              style={{
                position: "absolute",
                right: 10,
                top: 20,
                shadowColor: "#000",
                shadowOffset: { width: 0, height: 0 },
                shadowOpacity: 0.8,
                shadowRadius: 8,
                elevation: 15,
                zIndex: 1,
              }}
            >
              Clear screen
            </IconButton>
          </View>
        )}
      </View>
      {!images.length ? (
        <TouchableOpacity onPress={takePicture}>
          <MaterialCommunityIcons
            name="circle-slice-8"
            color={Colors.blue500}
            size={65}
            style={{
              alignSelf: "center",
              position: "absolute",
              bottom: 20,
            }}
          />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => {
            navigation.navigate("SavePost", { images });
          }}
        >
          <MaterialCommunityIcons
            name="check"
            color={Colors.blue500}
            size={65}
            style={{
              alignSelf: "center",
              position: "absolute",
              bottom: 20,
            }}
          />
          
        </TouchableOpacity>
      )}
      <View style={styles.buttonContainer}>
        <MaterialCommunityIcons name='video-image' size={30} color='black' onPress={pickImage} />
        {/* <IconButton size={30} icon="image" onPress={pickImage} /> */}
        <IconButton size={30} icon="camera" onPress={OpenCam} />
        <IconButton
          size={30}
          icon={flesh ? "flash" : "flash-off"}
          onPress={() => {
            setFlesh(
              flesh === Camera.Constants.FlashMode.off
                ? Camera.Constants.FlashMode.on
                : Camera.Constants.FlashMode.off
            );
          }}
        ></IconButton>

        <TouchableOpacity
          onPress={() => {
            setType(
              type === Camera.Constants.Type.back
                ? Camera.Constants.Type.front
                : Camera.Constants.Type.back
            );
          }}
        >
          <MaterialIcons
            name={type ? "camera-front" : "camera-rear"}
            color={"#000"}
            size={30}
            style={styles.flipcamera}
          />
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}
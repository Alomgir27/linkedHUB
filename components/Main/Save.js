import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
require("firebase/firebase-storage");
import { View, Text, Alert, Image, StyleSheet } from "react-native";
import { Button, TextInput, ProgressBar, Switch } from "react-native-paper";
import { auth, db, fs } from "../../firebase";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import axios from "axios";
import { baseURL } from "../config/baseURL";
import { useSelector } from "react-redux";
import Swiper from 'react-native-swiper';



const Save = (props) => {

  const [caption, setCaption] = useState("");
  const [loading, setLoading] = useState(false);
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [isSwitchOn, setIsSwitchOn] = useState(true);
  const [images, setImages] = useState([]);

  const user = useSelector((state) => state?.data?.currentUser);

    

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        setErrorMsg("Permission to access location was denied");
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocation(coordinates);
    })();
  }, []);

  useEffect(() => {
    let images = [];
    if (props?.route?.params?.images) {
      props.route.params.images.map((item) => {
        images.push({ type: item.type, uri: item.uri });
      });
    }
    setImages(images);
  }, [props?.route?.params?.images]);



  


  const uploadImage = async () => {
    if(loading)return;
    if(!images.length){
      Alert.alert("Please select an image");
      return;
    }
    setLoading(true);
    let downloadURLs = [];

    images.map(async (item) => {
      let uri = item.uri;
      let childPath = `${item.type}/${user?.uuid}/${Math.random().toString(36)}`;
      let responce = await fetch(uri);
      let blob = await responce.blob();
      let task = firebase.storage().ref().child(childPath).put(blob);
      let taskProgress = (snapshot) => {
        console.log("progress");
        console.log(`transferred: ${snapshot.bytesTransferred}`);
      };
      let taskCompleted = () => {
        task.snapshot.ref.getDownloadURL().then((snapshot) => {
          downloadURLs.push({ downloadURL: snapshot , type: item.type});
          console.log(snapshot);
          if (downloadURLs.length === images.length) {
            savePostData(downloadURLs);
          }
        });
      };
      let taskError = (snapshot) => {
        console.log(snapshot);
        Alert.alert("Error", "Something went wrong");
      };
      task.on("state_changed", taskProgress, taskError, taskCompleted);
    });


   
  };
  const savePostData = async (downloadURLs) => {
    let post = {
      uuid: user?.uuid,
      name: user?.name,
      userName: user?.userName,
      profilePic: user?.profilePic,
      caption: caption,
      downloadURLs: downloadURLs,
      location: {
        type: "Point",
        coordinates: [location?.longitude || 0, location?.latitude || 0],
      },
      likes: [],
      comments: [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await axios.post(`${baseURL}/api/posts`, post).then((res) => {
      console.log(res);
      setLoading(false);
      props.navigation.popToTop();
    })
    .catch((err) => {
      console.log(err);
      setLoading(false);
      Alert.alert("Error", "Something went wrong");
    });
  };

  


  return (
    <View style={styles.container}>
      <View style={styles.SquareShapeView}>
          <Swiper
            style={{ height: 256 }}
            showsButtons={true}
            showsPagination={false}
            loop={false}
          >
            {images?.map((item, index) => (
              <View key={index} style={{ flex: 1 }}>
                <Image
                  source={{ uri: item.uri }}
                  style={{ flex: 1, width: null, height: null }}
                />
              </View>
            ))}
          </Swiper>
                
      </View>


      <View style={{ width: "90%", marginTop: 10 }}>
        {/* <View style={{ flexDirection: "row", alignItems: "center" }}>
          <Text>Share location: </Text>
          <Switch value={isSwitchOn} onValueChange={onToggleSwitch} />
        </View> */}

        <TextInput
          placeholder="Write a caption"
          mode="outlined"
          dense={false}
          value={caption}
          onChangeText={(text) => setCaption(text)}
          multiline={true}
          numberOfLines={5}
        />
        <View style={{ marginTop: loading ? 20 : 0 }}>
          {loading ? <ProgressBar indeterminate={true} /> : null}
          <Button
            icon="upload"
            loading={loading}
            mode="contained"
            onPress={() => uploadImage()}
            style={{ marginTop: 20 }}
          >

            <Text style={{ color: "#fff" }}>{loading ? "Uploading" : "Upload"}</Text>
          </Button>

          </View>

       
      </View>
    </View>
  );
};
export default Save;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 20,
    justifyContent: "flex-start",
    alignItems: "center",
    backgroundColor: "#FFF",
  },

  SquareShapeView: {
    width: 192,
    height: 256,
    backgroundColor: "#fff",
  },
});





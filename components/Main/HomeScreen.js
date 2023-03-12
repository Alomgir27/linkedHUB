import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, ImageBackground, Alert } from "react-native";
import { Appbar, Colors } from "react-native-paper";
import { Ionicons, Feather } from "@expo/vector-icons";
import AllPosts from "./AllPosts";
import { fetchAllPosts, fetchUser } from "../../components/UserFunctions";
import Stories from "../reusable/Stories";

import { 
  fetchUserPosts,
  fetchUserPostsMore,
  fetchUsers 
 } from "../redux/actions";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const HomeScreen = ({ navigation }) => {


  const [loading, setLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isPause, setIsPause] = useState(false);
  const [location, setLocation] = useState(null);
  const user = useSelector((state) => state?.data?.currentUser);
  const posts = useSelector((state) => state?.data?.posts);
  const dispatch = useDispatch();

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission to access location was denied");
        return;
      }
      const location = await Location.getCurrentPositionAsync({});
      const coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setLocation(coordinates);
    })();
  }, []);


  useEffect(() => {
    navigation.addListener("focus", () => {
      setIsPause(false)
      if(user){
        let uuids = user?.following?.concat(user?.uuid)
        uuids = uuids?.concat(user?.friends)
        setLoading(true);
        dispatch(fetchUserPosts(uuids, setLoading));
        dispatch(fetchUsers(uuids, location, setLoading));
      }
    });
    navigation.addListener('blur', () => {
      setIsPause(true);

    })

  }, [navigation, user]);



  const fetchPosts = () => {
    if(user){
      setLoading(true);
      let uuids = user?.following?.concat(user?.uuid)
      uuids = uuids?.concat(user?.friends)
      dispatch(fetchUserPosts(uuids, setLoading));
    }
  };

  const fetchMore = () => {
    if(user){
      setLoading(true);
      let uuids = user?.following?.concat(user?.uuid)
      uuids = uuids?.concat(user?.friends)
      dispatch(fetchUserPostsMore(uuids, posts?.length, setLoading));
    }
  };



 
      

 
  return (
    <View style={{ flex: 1, backgroundColor: Colors.grey200 }} >
      <Appbar.Header
        style={{
          backgroundColor: "white",
          shadowColor: "black",
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 1,
          elevation: 5,
        }}
      >
        
       {/* add appname linkedHUB */}
        <Appbar.Content
          title="linkedHUB"
          titleStyle={{ shadowColor: "black", shadowOffset: { width: 0, height: 0 }, shadowOpacity: 0.5, shadowRadius: 1, elevation: 5, color: "black", fontSize: 20 }}
          onPress={() => navigation.navigate("Home")}
        />
        <Appbar.Action
          icon={() => (
            <MaterialCommunityIcons name="magnify" size={24} color="black" />
          )}
          onPress={() => navigation.navigate("Search")}
        />
       {/* Music player add */}

       <Appbar.Action
          icon={() => (
            <MaterialCommunityIcons name="music-circle-outline" size={24} color="black" />
          )}
          onPress={() => navigation.navigate("Music")}
        />

        <Appbar.Action
          icon={() => (
            <Feather name="bell" size={24} color="black" />
          )}
          onPress={() => navigation.navigate("Notifications")}
        />

        <Appbar.Action
          icon={() => (
            <Ionicons name="ellipsis-vertical" size={24} color="black" />
          )}
          onPress={() => navigation.navigate("More")}
        />


      </Appbar.Header>

      <AllPosts
        header={
          <View>
            <Stories navigation={navigation}  />
          </View>
        }
        navigation={navigation}
        posts={posts}
        fetchPosts={fetchPosts}
        user={user}
        loading={loading}
        isMuted={isMuted}
        setIsMuted={setIsMuted}
        isPause={isPause}
        setIsPause={setIsPause}
        fetchMore={fetchMore}
      />
    </View>
  );
};

export default HomeScreen;

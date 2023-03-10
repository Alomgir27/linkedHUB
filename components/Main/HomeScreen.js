import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import { Appbar, Colors } from "react-native-paper";
import { Ionicons, Feather } from "@expo/vector-icons";
import AllPosts from "./AllPosts";
import { fetchAllPosts, fetchUser } from "../../components/UserFunctions";
import Stories from "../reusable/Stories";

import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { getUserByUUID } from "../redux/actions";
import * as Location from "expo-location";
import { MaterialCommunityIcons } from "@expo/vector-icons";

import { auth } from "../../firebase";




const HomeScreen = ({ navigation }) => {


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state?.data?.currentUser);
  const dispatch = useDispatch();

  

  useEffect(() => {
    fetchPosts();
  }, []);


  const fetchPosts = async () => {
    setLoading(true);
    await fetchAllPosts((posts) => {
      setPosts(posts);
      setLoading(false);
    });
    (async () => {
      let location = await Location.getCurrentPositionAsync({});
      let coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      auth.onAuthStateChanged(async (user) => {
        if (user) {
            dispatch(getUserByUUID(user.uid, coordinates, setLoading));
        }
      });
    })();
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
            <Stories navigation={navigation} />
          </View>
        }
        navigation={navigation}
        posts={posts}
        fetchPosts={fetchPosts}
        user={user}
        loading={loading}
      />
    </View>
  );
};

export default HomeScreen;

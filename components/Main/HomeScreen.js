import React, { useEffect, useState, useRef } from "react";
import { View, Text, Image, ImageBackground } from "react-native";
import { Appbar, Colors } from "react-native-paper";
import { Ionicons, Feather } from "@expo/vector-icons";
import AllPosts from "./AllPosts";
import { fetchAllPosts, fetchUser } from "../../components/UserFunctions";
import Stories from "../reusable/Stories";

import { useSelector } from "react-redux";


const HomeScreen = ({ navigation }) => {


  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const user = useSelector((state) => state?.data?.currentUser);


  
  

  useEffect(() => {
    fetchPosts();
  }, []);


  const fetchPosts = async () => {
    setLoading(true);
    await fetchAllPosts((posts) => {
      setPosts(posts);
      setLoading(false);
    });
  };

 
  return (
    <View style={{ flex: 1, backgroundColor: Colors.grey200 }} >
      <Appbar.Header
        style={{
          backgroundColor: "#fff0",
          justifyContent: "space-between",
          borderRadius: 15,
          elevation: 0,
        }}
      >
        <Appbar.Action
          icon={() => {
            return <Feather name="camera" size={24} color="black" />;
          }}
          onPress={() => navigation.navigate("StoryScreen")}
        />
        <Image
          source={require("../../assets/headTitle.png")}
          style={{ height: 25, width: 160 }}
        />
        <Appbar.Action
          icon={() => {
            return (
              <Ionicons
                name="ios-chatbox-ellipses-outline"
                size={24}
                color="black"
              />
            );
          }}
          onPress={() => navigation.navigate("ChatScreen")}
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

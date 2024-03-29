import React, { useEffect, useState } from "react";
import {
  View,
  StyleSheet,
  SafeAreaView,
  Alert,
  FlatList,
  useWindowDimensions,
  TouchableOpacity,
  RefreshControl,
  Image,
} from "react-native";

import {
  Button,
  Avatar,
  Divider,
  Appbar,
  ActivityIndicator,
  IconButton,
  Caption,
  Modal,
} from "react-native-paper";
import { Text } from "react-native-elements";

import { auth, db, fs } from "../../firebase";
import {
  fetchUser,
  fetchUserPosts,
  fetchUserSavedPosts,
} from "../../components/UserFunctions";
import { Ionicons, MaterialIcons } from "@expo/vector-icons";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import { useFocusEffect } from "@react-navigation/native";
import { useSelector } from "react-redux";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { BottomSheet } from "react-native-elements";
import { ScrollView } from "react-native-gesture-handler";
import { useIsFocused } from "@react-navigation/native";


import styles from "./styles";

import { clearData } from "../redux/actions";

import { useDispatch } from "react-redux";

const Tab = createMaterialTopTabNavigator();

const Profile = ({ navigation }, props) => {


  const width = useWindowDimensions().width;
  const [post, setpost] = useState([]);
  const [savedPost, setSavedPost] = useState([]);
  const user = useSelector((state) => state?.data?.currentUser);
  const dispatch = useDispatch();


  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchUser("", (user) => {
      console.log("user: ", user);
      // setUser(user);
      fetchPosts(user.id);
      fetchSavedPosts(user?.savedPost);
    });
  }, []);
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      fetchPosts(auth.currentUser.uid);
    });
    // Return the function to unsubscribe from the event so it gets removed on unmount
    return unsubscribe;
  }, [navigation]);

  const fetchPosts = (userId) => {
    setLoading(true);
    fetchUserPosts(userId, (posts) => {
      setpost(posts);
      setLoading(false);
    });
  };

  const fetchSavedPosts = (savedPosts) => {
    console.log("savedPosts: ", savedPosts);
    setLoading(true);
    fetchUserSavedPosts(savedPosts, (posts) => {
      console.log("saved posts are: ", posts.length);
      setSavedPost(posts);
      setLoading(false);
    });
  };


 


  const renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("UserPosts", {
            post,
            index,
            user,
            savedPost: user.savedPost,
          });
        }}
      >
        <Image
          PlaceholderContent={
            <ActivityIndicator animating={true} color={"gray"} size="small" />
          }
          source={{
            uri: item.downloadURL,
          }}
          style={{
            flex: 1,
            marginRight: 1.5,
            marginBottom: 1.5,
            width: width / 3,
            height: width / 3,
          }}
        />
      </TouchableOpacity>
    );
  };
  const renderSavedItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("UserPosts", {
            post: savedPost,
            index,
            user,
            savedPost: user.savedPost,
          });
        }}
      >
        <Image
          PlaceholderContent={
            <ActivityIndicator animating={true} color={"gray"} size="small" />
          }
          source={{
            uri: item.downloadURL,
          }}
          style={{
            flex: 1,
            marginRight: 1.5,
            marginBottom: 1.5,
            width: width / 3,
            height: width / 3,
          }}
        />
      </TouchableOpacity>
    );
  };
  const PostsScreen = () => {
    return (
      <FlatList
        style={{ paddingTop: 2 }}
        numColumns={3}
        horizontal={false}
        data={post}
        refreshControl={
          <RefreshControl
            onRefresh={() => fetchPosts(user.id)}
            refreshing={loading}
          />
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    );
  };
  const PostsTaggedScreen = () => {
    return (
      <FlatList
        style={{ paddingTop: 2 }}
        numColumns={3}
        horizontal={false}
        data={savedPost}
        refreshControl={
          <RefreshControl
            onRefresh={() => fetchSavedPosts(user?.savedPost)}
            refreshing={loading}
          />
        }
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        renderItem={renderSavedItem}
        keyExtractor={(item) => item.id}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>

      <Appbar.Header
        style={{
          backgroundColor: "transparent",
          elevation: 0,
          justifyContent: "space-between",
        }}
      >
        <Appbar.Content
          title={user?.userName ? user?.userName : user?.name}
          titleStyle={{ fontWeight: "bold" }}
        />
        <Appbar.Action
          icon="sign-out"
          onPress={() => {
            auth.signOut();
            dispatch(clearData());
            navigation.navigate("Login");
          }}
        />
       



      </Appbar.Header>
      <View style={styles.contentContainer}>
        <View style={styles.userRaw}>
          <Avatar.Image
            style={{ elevation: 10 }}
            size={100}
            source={
              user?.profilePic
                ? { uri: user?.profilePic }
                : require("../../assets/defaultProfilePic.png")
            }
          />
          <View style={{ flex: 1 }}>
            <View style={styles.userDataContaienr}>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>
                  {post?.length}
                </Text>
                <Caption style={{ marginTop: -5 }}>Posts</Caption>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>245</Text>
                <Caption style={{ marginTop: -5 }}>Followers</Caption>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={{ fontWeight: "bold", fontSize: 18 }}>245</Text>
                <Caption style={{ marginTop: -5 }}>Following</Caption>
              </View>
            </View>
            <Button
              mode="contained"
              color="#84a59d"
              labelStyle={{ color: "white" }}
              style={{ marginHorizontal: 10 }}
              onPress={() => {
                navigation.navigate("EditProfile", {
                  user: user,
                  navigation,
                });
              }}
            >
              Edit profile
            </Button>
          </View>
        </View>
        {user?.name && user?.name != "" && (
          <Text style={styles.boldText}>{user?.name}</Text>
        )}
        {user?.bio && user?.bio != "" && (
          <Caption style={styles.caption}>{user?.bio}</Caption>
        )}
      </View>

      <Tab.Navigator
        screenOptions={{
          tabBarActiveTintColor: "#84a59d",
          tabBarInactiveTintColor: "gray",
          tabBarShowLabel: false,
          tabBarShowIcon: true,
          tabBarIndicatorStyle: {
            height: 2,
            backgroundColor: "#84a59d",
          },
        }}
      >
        <Tab.Screen
          name="Posts"
          options={{
            tabBarIcon: ({ color, size, focused }) => (
              <MaterialIcons name="grid-on" size={24} color={color} />
            ),
          }}
          component={PostsScreen}
        />
        <Tab.Screen
          name="TaggedPosts"
          options={{
            tabBarIcon: ({ color, size }) => (
              <MaterialIcons name="bookmark-border" size={24} color={color} />
            ),
          }}
          component={PostsTaggedScreen}
        />
      </Tab.Navigator>

      <TouchableOpacity style={{ position: "absolute", bottom: 20, right: 20, backgroundColor: "#84a59d", padding: 10, borderRadius: 50 }} onPress={() => navigation.navigate("AddPost")}>
        <MaterialIcons name="add" size={24} color="white" />
      </TouchableOpacity>

    </SafeAreaView>
  );
};

export default Profile;

import React, { useState, useEffect } from "react";
import { Alert, LogBox } from "react-native";

//navigation
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

//Screens
import Login from "../components/Auth/Login";
import Register from "../components/Auth/Register";
import ForgotPW from "../components/Auth/ForgotPW";

import MainScreen from "../components/MainTab";
import SavePost from "../components/Main/Save";
import UserPosts from "../components/Main/UserPosts";
import EditProfile from "../components/Main/EditProfile";
import OtherProfile from "../components/Main/OtherProfile";
import ShortVideo from "../components/Main/ShortVideo";

import { auth, db } from "../firebase";
import { Text, View } from "react-native";
import { ActivityIndicator, Colors } from "react-native-paper";
import Signup from "../components/Auth/Register";

import ChatScreen from "../components/chat/ChatList";
import Chat from "../components/chat/Chat";

import UnderConstruction from "../components/reusable/UnderConstruction";
import UserStoriesScreen from "../components/reusable/UserStoriesScreen";
import FullScreenImage from "../components/reusable/FullScreenImage";


import StoryFileUploader from "../components/Upload/StoryFileUploader";
import PostUploader from "../components/Upload/PostUploader";

import { getUserByUUID } from "../components/redux/actions";

import { useDispatch } from "react-redux";
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

LogBox.ignoreLogs(["Possible Unhandled Promise Rejection"]);


const Stack = createNativeStackNavigator();

export default function NavigationStack({ navigation }) {

  const [loading, setLoading] = useState(true);
  const [login, setLogin] = useState(false);
  const [coordinates, setCoordinates] = useState(null);
  

  const dispatch = useDispatch();



  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      let coordinates = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      };
      setCoordinates(coordinates);
    })();
  }, []);




  
  
  useEffect(() => {
    (async () => {
      auth.onAuthStateChanged(async (user) => {
        if (!user) {
          setLogin(false);
          setLoading(false);

        } 
        else if(!user.emailVerified){
         user.sendEmailVerification();
         Alert.alert(
          "Email Verification",
          "You need to verify your email before login. Please check your email.",
          [
            {
              text: "Send Again",
              onPress: () => {
                user.sendEmailVerification();
                setLogin(false);
                setLoading(false);
              }
            },
            {
              text: "OK",
              onPress: () => {
                auth.signOut();
                setLogin(false);
                setLoading(false);
              }
            },
          ],
          { cancelable: true }
           
        );
        }
        else {
         
          dispatch(getUserByUUID(user.uid, coordinates, setLoading));
          setLogin(true);
          
        }
      });
    })();
  }, []);

  const StoryScreen = ({ navigation }) => {
    return (
      <UnderConstruction
        screenName="Upload Story"
        navigation={navigation}
        showHeader={true}
        backgroundColor="#fffafb"
      />
    );
  };

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator
          animating={true}
          color={Colors.blue400}
          size="large"
        />
      </View>
    );
  } else if (!login) {
    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen
            options={{ headerLargeTitle: true }}
            name="Login"
            component={Login}
          />
          <Stack.Screen
            options={{ headerLargeTitle: true }}
            name="Signup"
            component={Signup}
          />
          <Stack.Screen
            options={{ headerLargeTitle: true }}
            name="Register"
            component={Register}
          />
          <Stack.Screen
            name="ForgotPW"
            component={ForgotPW}
            options={{
              headerShown: true,
              title: "Forgot password",
              headerLargeTitle: true,
            }}
          />
          <Stack.Screen
            name="Main"
            component={MainScreen}
            options={{
              headerShown: false,
              headerTitle: "linkedHub",
              title: "linkedHub",
            }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
  return (
    <NavigationContainer>
      <Stack.Navigator
       initialRouteName="Main"
      >
        <Stack.Screen
          name="Main"
          component={MainScreen}
          options={{
            headerShown: false,
            headerTitle: "linkedHub",
            title: "linkedHub",

          }}
          navigation={navigation}

        />
        <Stack.Screen
          name="SavePost"
          component={SavePost}
          navigation={navigation}
        />
        <Stack.Screen
          name="UserPosts"
          options={{
            headerTitle: "Posts",
            title: "Posts",
          }}
          component={UserPosts}
          navigation={navigation}
        />
        <Stack.Screen
          name="EditProfile"
          component={EditProfile}
          navigation={navigation}
          options={({ navigation, route }) => ({
            headerTitle: "Edit Profile",
            title: "Edit Profile",
          })}
        />
        <Stack.Screen
          name="OtherProfile"
          component={OtherProfile}
          navigation={navigation}
        />
        <Stack.Screen
          name="Chat"
          component={Chat}
          navigation={navigation}
          options={{
            headerShown: false,
            headerTitle: "Chat",
          }
        }
        />
        <Stack.Screen name="ChatScreen" 
          component={ChatScreen} 
          navigation={navigation}
          options={{
            headerShown: false,
          }}
        />

        <Stack.Screen
          name="StoryScreen"
          component={StoryScreen}
          navigation={navigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="ShortVideo"
          component={ShortVideo}
          navigation={navigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="StoryFileUploader"
          component={StoryFileUploader}
          navigation={navigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="AddPost"
          component={PostUploader}
          navigation={navigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="StoryViewer"
          component={UserStoriesScreen}
          navigation={navigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="FullScreenPicture"
          component={FullScreenImage}
          navigation={navigation}
          options={{
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="Login"
          component={Login}
          navigation={navigation}
          options={{
            headerShown: false,
          }}
        />


      </Stack.Navigator>
    </NavigationContainer>
  );
}

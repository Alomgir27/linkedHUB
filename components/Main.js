//react redux
import React, { useEffect, useState, useRef } from "react";
import { Image } from "react-native";
//screens
import HomeScreen from "./Main/Feed";
import profileScreen from "./Main/Profile";
import searchScreen from "./Main/Search";
import notifiationScreen from "./Main/Notification";
import { ScrollView } from "react-native-gesture-handler";
import { View } from "react-native";
import ShortVideo from "./Main/ShortVideo";
import { ActivityIndicator } from "react-native-paper";
import { useSelector } from "react-redux";
import { TouchableOpacity } from "react-native";

//bottom tab navigation
import {
  createBottomTabNavigator,
  createStackNavigator,
} from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign , FontAwesome5, FontAwesome} from "@expo/vector-icons";
import { Colors } from "react-native-paper";
import { LinearGradient } from "expo-linear-gradient";
import ChatScreen from "./chat/ChatList";



const Tab = createBottomTabNavigator();
const EmptyScreen = () => {
  return null;
};

const Main = ({ navigation }) => {

  const user = useSelector((state) => state?.data?.currentUser);

  return (
   <View style={{backgroundColor: "#fff", flex: 1}}>
    <Tab.Navigator
      shifting={true}
      initialRouteName="Home"
      
      screenOptions={({ route }) => ({
        tabBarShowLabel: false,
        tabBarStyle: {
          elevation: 2,
          shadowColor: "#171717",
          shadowOffset: { width: -2, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
          backgroundColor: Colors.white,
          paddingBottom: -8,
          height: 70,
          position: "relative",
          borderTopWidth: 0,
          display: "flex",
        },
        safeAreaInsets: {
          bottom: 0,
        },
        headerShown: false,
      tabBarIcon: ({ focused, color, size, el }) => {
        let iconName;
        if (route.name === "Home") {
          iconName = focused ? "home" : "ios-home-outline";
          size = focused ? 30 : 28;
          color = "#a2d2ff";
        } else if (route.name === "Profile") {
          iconName = focused ? "ios-person" : "ios-person-outline";
          size = focused ? 30 : 28;
          color = "#a2d2ff";
        } else if (route.name === "ChatScreen") {
          iconName = focused ? "chatbubbles" : "chatbubbles-outline";
          size = focused ? 32 : 30;
          color = "#a2d2ff";
        } else if (route.name === "ShortVideo") {
          iconName = focused ? "videocam" : "videocam-outline";
          size = focused ? 30 : 28;
          color = "#a2d2ff";
        }

        if(route.name === "Profile"){
          return (
            <LinearGradient 
            colors={[Colors.blue400, Colors.blue500, Colors.blue600, Colors.blue700, Colors.blue800, Colors.blue900]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={{
              width: 50,
              height: 50,
              borderRadius: 50,
              justifyContent: "center",
              alignItems: "center",
              elevation: el,
              shadowOffset: {
                height: 0,
                width: 0,
              },
              borderWidth: 2,
              borderColor: "#fff",
            
            }}
            >
              <TouchableOpacity
              onPress={() => navigation.navigate("Profile")}
              >
              <Image
                source={{ uri: user?.profilePic }}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
              />
              </TouchableOpacity>
            </LinearGradient>
          );
        }

        return (
          route.name === "ShortVideo" ? (
            <View
              style={{
                width: 50,
                height: 50,
                borderRadius: 50,
                justifyContent: "center",
                alignItems: "center",
                elevation: el,
                shadowOffset: {
                  height: 0,
                  width: 0,
                },
                borderWidth: 2,
                borderColor: "#fff",
                backgroundColor: "#fff",
              }}
            >
              <Image
                source={require("../assets/shorts.png")}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 50,
                  borderWidth: 2,
                  borderColor: "#fff",
                }}
                />
                {focused ? (
                  <View
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 50,
                      backgroundColor: "#a2d2ff",
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      borderWidth: 2,
                      borderColor: "#fff",
                    }}
                  />
                ) : null

                    }
            </View>
        ) : (
            <Ionicons
              name={iconName}
              size={size}
              color={color}
              style={{
                borderBottomWidth: 2,
                borderBottomColor: focused ? color : "#fff",
                padding: 10,
                elevation: el,
                shadowOffset: {
                  height: 0,
                  width: 0,
                },
              }}
            />
          )
        );
      },
    })}
    >
      <Tab.Screen
        name="Home"
        options={{ title: "linkedHUB" }}
        component={HomeScreen}
      />
      
      <Tab.Screen name="ShortVideo" component={ShortVideo} />
      <Tab.Screen
        name="AddContainer"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("AddPost");
          },
        })}
        options={{
          tabBarIcon: () => (
            <AntDesign
              name="pluscircleo"
              size={30}
              color="#a2d2ff"
              style={{
                padding: 10,
                elevation: 5,
                shadowOffset: {
                  height: 0,
                  width: 0,
                },
              }}
            />
          ),
        }}
      />
      <Tab.Screen name="ChatScreen" component={ChatScreen} />
      <Tab.Screen name="Profile" component={profileScreen} />
    </Tab.Navigator>
    </View>
  );
};

export default Main;

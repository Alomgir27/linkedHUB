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


//bottom tab navigation
import {
  createBottomTabNavigator,
  createStackNavigator,
} from "@react-navigation/bottom-tabs";
import { Ionicons, AntDesign , FontAwesome5, FontAwesome} from "@expo/vector-icons";
import { Colors } from "react-native-paper";


const Tab = createBottomTabNavigator();
const EmptyScreen = () => {
  return null;
};

const Main = ({ navigation }) => {

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
        tabBarIcon: ({ focused, color, size, el, activeColor }) => {
          let iconName;
          if (route.name === "Home") {
            iconName = focused ? "home" : "ios-home-outline";
            size = focused ? 30 : 28;
            color = "#a2d2ff";
          } else if (route.name === "Profile") {
            iconName = focused ? "ios-person" : "ios-person-outline";
            size = focused ? 30 : 28;
            color = "#a2d2ff";
          } else if (route.name === "Notification") {
            iconName = focused ? "heart-sharp" : "heart-outline";
            size = focused ? 32 : 30;
            color = "#f7b801";
          } else if (route.name === "ShortVideo") {
            iconName = focused ? "videocam" : "videocam-outline";
            size = focused ? 30 : 28;
            color = "#f7b801";
          }
          return (
            route.name === "ShortVideo" ? (
            <FontAwesome
              name={focused ? "play-circle" : "play-circle-o"}
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
      
      {/* <Tab.Screen name="Search" component={searchScreen} /> */}
      <Tab.Screen name="ShortVideo" component={ShortVideo} />
      <Tab.Screen
        name="AddContainer"
        component={EmptyScreen}
        listeners={({ navigation }) => ({
          tabPress: (event) => {
            event.preventDefault();
            navigation.navigate("Add");
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
      <Tab.Screen name="Notification" component={notifiationScreen} />
      <Tab.Screen name="Profile" component={profileScreen} />
    </Tab.Navigator>
    </View>
  );
};

export default Main;

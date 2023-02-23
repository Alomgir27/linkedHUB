import React from "react";

import { View, Text, Image } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatList from "./chat/ChatList";

import UnderConstruction from "../components/reusable/UnderConstruction";

import HomeScreen from "./Main";


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


const Tab = createMaterialTopTabNavigator();

export default function MainTab({ navigation }) {
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <Tab.Navigator tabBar={() => {}} initialRouteName="HomeScreen">
       <Tab.Screen name="StoryScreen" component={StoryScreen} navigation={navigation} />
        <Tab.Screen name="HomeScreen" component={HomeScreen} navigation={navigation} />
        <Tab.Screen name="ChatScreen" component={ChatList} navigation={navigation} />
      </Tab.Navigator>
    </View>
  );
}

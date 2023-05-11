import React from "react";

import { View, Text, Image } from "react-native";

import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import ChatList from "./chat/ChatList";

import HomeScreen from "./Main";

const Tab = createMaterialTopTabNavigator();

export default function MainTab({ navigation }) {
  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
        {/* <Tab.Screen name="HomeScreen" component={HomeScreen} navigation={navigation} />
        <Tab.Screen name="ChatScreen" component={ChatList} navigation={navigation} /> */}
        <HomeScreen navigation={navigation} />
    </View>
  );
}

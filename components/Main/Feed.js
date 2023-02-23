import React from "react";
import { View, Text, Image } from "react-native";
import { createMaterialTopTabNavigator } from "@react-navigation/material-top-tabs";
import HomeScreen from "./HomeScreen";
import UnderConstruction from "../reusable/UnderConstruction";

const Tab = createMaterialTopTabNavigator();

const Feed = ({ navigation }) => {

  return (
    <View style={{ backgroundColor: "#fff", flex: 1 }}>
      <HomeScreen navigation={navigation} />
    </View>
  );
};

export default Feed;

import React from "react";
import { View, Text, Image } from "react-native";
import HomeScreen from "./HomeScreen";


const Feed = ({ navigation }) => {

  return (
    <View style={{ flex: 1 }}>
      <HomeScreen navigation={navigation} />
    </View>
  );
};

export default Feed;




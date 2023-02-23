import { View, TouchableOpacity, Image, Text, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import React from "react";
import { Colors, IconButton } from "react-native-paper";
import dynamicStyles from "./styles";



const HeaderComponent = ({user, text, navigation}) => {
  const styles = dynamicStyles();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate("AddStory")}>
        <LinearGradient
          colors={["#fffff", "#fffff"]}
          style={styles.storyAvatarBG}
        >
          <Image
            source={{ uri: user.profilePicUrl }}
            style={[styles.storyAvatar, { borderColor: "white", borderWidth: 2 }]}
          />
        </LinearGradient>
        <IconButton
          style={styles.storyPlusIcon}
          size={15}
          color={Colors.white}
          icon="plus"
        />
      </TouchableOpacity>
      <Text
        style={{
          marginTop: 5,
          textAlign: "center",
        }}
      >
        {text}
      </Text>
    </View>
  );
};

const Stories = (props) => {
  const { stories, user } = props;
  const styles = dynamicStyles();
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity>
          <LinearGradient
            colors={["#DE0046", "#F7A34B"]}
            style={styles.storyAvatarBG}
          >
            <Image
              source={{ uri: item.image }}
              style={[
                styles.storyAvatar,
                { borderColor: "white", borderWidth: 2 },
              ]}
            />
          </LinearGradient>
        </TouchableOpacity>
        <Text
          style={{
            marginTop: 5,
            textAlign: "center",
          }}
        >
          {item.name}
        </Text>
      </View>
    );
  };
  
  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={stories}
        ListHeaderComponent={() => (
          <HeaderComponent user={user} text="Your story" {...props} />
        )}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

export { HeaderComponent};

export default Stories;

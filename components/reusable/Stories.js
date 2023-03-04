import { View, TouchableOpacity, Image, Text, FlatList, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import React , { useEffect , useState} from "react";
import { Colors, IconButton } from "react-native-paper";
import dynamicStyles from "./styles";
import { useSelector } from "react-redux";


const HeaderComponent = ({user, text, navigation}) => {
  const styles = dynamicStyles();
  return (
    <View>
      <TouchableOpacity onPress={() => navigation.navigate("StoryFileUploader")}>
        <LinearGradient
          colors={[Colors.blue500, Colors.blue700]}
          style={styles.storyAvatarBG}
        >
          <Image
            source={{ uri: user?.profilePic }}
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
        { text }
      </Text>
    </View>
  );
};

const Stories = (props) => {
  const styles = dynamicStyles();
  const user = useSelector(state => state?.data?.currentUser);
  const stories = useSelector(state => state?.data?.usersStory);
  const storiesByUUID = useSelector(state => state?.data?.usersStoryByUUID);

  useSelector(state => console.log("storiesByUUID", state?.data));

  if (!stories || stories.length === 0 || !storiesByUUID || Object.keys(storiesByUUID).length === 0) {
    return null;
  }

  
  const renderItem = ({ item }) => {
    return (
      <View>
        <TouchableOpacity onPress={() => props.navigation.navigate("StoryViewer", { stories: storiesByUUID[item.uuid] })}>
          <LinearGradient
            colors={storiesByUUID[item.uuid]?.seen ? [Colors.grey500, Colors.grey500] : [Colors.blue500, Colors.blue700]}
            style={styles.storyAvatarBG}
          >
            <Image
              source={{ uri: item?.image }}
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
          {item?.name}
        </Text>
      </View>
    );
  };
  
  return (
    <View>
      <FlatList
        horizontal
        showsHorizontalScrollIndicator={false}
        data={stories && stories.length > 0 ? stories : []}
        ListHeaderComponent={() => (
          <HeaderComponent user={user} text="Your story" {...props} />
        )}
        renderItem={(item) => renderItem(item, props)}
        keyExtractor={(item) => item._id}
      />
    </View>
  );
};


export default Stories;

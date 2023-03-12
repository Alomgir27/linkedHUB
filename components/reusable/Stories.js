import { View, TouchableOpacity, Image, Text, FlatList, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";

import React , { useEffect , useState} from "react";
import { Colors, IconButton } from "react-native-paper";
import dynamicStyles from "./styles";
import { useSelector } from "react-redux";

import { RefreshControl } from "react-native";

import { useDispatch } from "react-redux";

import { 
  fetchUsersStory,
  fetchUsersStoryMore
  } from "../redux/actions";


const HeaderComponent = ({user, text, navigation}) => {
  const styles = dynamicStyles();
  return (
    <View style={{ flex: 1, marginVertical: 10 }}>
      <TouchableOpacity onPress={() => navigation.navigate("StoryFileUploader")}>
        <LinearGradient
          colors={[Colors.purple400, Colors.purple500, Colors.purple700, Colors.purple900]}
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
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(false);
  const [oldStories, setOldStories] = useState([]);

  const user = useSelector(state => state?.data?.currentUser);
  const stories = useSelector(state => state?.data?.usersStory);
  const storiesByUUID = useSelector(state => state?.data?.usersStoryByUUID);

  useEffect(() => {
    props.navigation.addListener("focus", () => {
      if(user){
        dispatch(fetchUsersStory(user, setLoading));
      }
    });
  }, []);

  useEffect(() => {
    if(storiesByUUID){
      let oldStories = [];
      Object.keys(storiesByUUID).forEach((key) => {
        oldStories = [...oldStories, ...storiesByUUID[key]];
      });
      setOldStories(oldStories);
    }
  }, [storiesByUUID]);

  const fetchMoreStories = async () => {
    if(user){
      setLoading(true);
      dispatch(fetchUsersStoryMore(user, oldStories, setLoading));
    }
  };

  
 
  const onStoryPress = (story) => {
    props.navigation.navigate("StoryViewer", { stories: storiesByUUID[story.uuid] });
  };



  
  const renderItem = ({ item}) => {
    return (
      <View style={{ flex: 1, marginVertical: 10 }}>
        <TouchableOpacity onPress={() => onStoryPress(item)}>
          <LinearGradient
            colors={storiesByUUID[item.uuid]?.seen ? [Colors.grey400, Colors.grey500, Colors.grey600, Colors.grey700, Colors.grey800, Colors.grey900] : [Colors.blue400, Colors.blue500, Colors.blue700, Colors.blue900]}
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
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={loading && stories?.length === 0} onRefresh={fetchMoreStories} />
        }
        data={stories && stories.length > 0 ? stories : []}
        ListHeaderComponent={() => (
          <HeaderComponent user={user} text="Your story" {...props} />
        )}
        renderItem={(item) => renderItem(item)}
        keyExtractor={(item) => item._id}
        onEndReached={oldStories?.length > 0 && oldStories?.length % 100 === 0 ? fetchMoreStories : null}
        onEndReachedThreshold={0.5}
        onMomentumScrollBegin={() => { setLoading(false) }}


      />
    </View>
  );
};


export default Stories;

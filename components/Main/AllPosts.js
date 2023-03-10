import React, { useEffect, useState, useRef } from "react";
import { View, Text, RefreshControl } from "react-native";
import PostCard from "../reusable/PostCard";

import { FlatList } from "react-native";

import { useSelector } from "react-redux";


const AllPosts = (props) => {
  const user = useSelector((state) => state?.data?.currentUser);
  const posts = useSelector((state) => state?.data?.posts);

  const { navigation, fetchPosts, loading, header } = props;

  const [currentIndex, setCurrentIndex] = useState(0);

  const flatListRef = useRef();


  const hadleOnMomentumScrollEnd = (event) => {
    const index = Math.round(
      event.nativeEvent.contentOffset.y /
        event.nativeEvent.layoutMeasurement.height
    );
    setCurrentIndex(index);
  };






  return (
    <View style={{ flex: 1 }}>
      <FlatList
        ref={flatListRef}
        showsVerticalScrollIndicator={false}
        showsHorizontalScrollIndicator={false}
        ListHeaderComponent={header && header}
        refreshControl={
          <RefreshControl refreshing={loading} onRefresh={() => fetchPosts()} />
        }
        data={posts}
        renderItem={({ item, index }) => (
          <PostCard
            downloadURLs={(item?.downloadURLs && item?.downloadURLs) || []}
            index={index}
            post={item}
            uuid={item?.uuid}
            caption={item?.caption}
            userName={item?.userName}
            name={item?.name}
            profilePic={item?.profilePic}
            savedPost={user?.savedPost}
            date={item?.updatedAt}
            likes={item?.likes}
            comments={item?.comments}
            user={user}
            navigation={navigation}
            currentIndex={currentIndex}
            location={item?.location}
          />
        )}
        ListFooterComponent={() => (
          <View style={{ height: 1000 }}>
            <Text></Text>
          </View>
        )}
        ListFooterComponentStyle={{
          height: 200,
        }}
        // initialScrollIndex={props.route.params.index}
        keyExtractor={(item) => item.id}
        onEndReachedThreshold={0.5}
        onEndReached={() => {
          console.log("end reached");
        }}
        onMomentumScrollEnd={hadleOnMomentumScrollEnd}
      />
    </View>
  );
};

export default AllPosts;

import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { View, Text, RefreshControl } from "react-native";
import PostCard from "../reusable/PostCard";

import { FlatList } from "react-native";

import { useSelector } from "react-redux";


const AllPosts = (props) => {

  
  const user = useSelector((state) => state?.data?.currentUser);
  const { navigation, posts, fetchPosts, loading, header,  fetchMore  } = props;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [shouldPlay, setShouldPlay] = useState(true);

  const flatListRef = useRef();



  useEffect(() => {
    props.navigation.addListener("focus", () => {
      setShouldPlay(true);
    });
    props.navigation.addListener("blur", () => {
      setShouldPlay(false);
    });
  }, [props.navigation]);


  const handleViewableItemsChanged = useCallback(({ viewableItems }) => {
    const visibleItems = viewableItems;
    const currentItemIndex = visibleItems[0]?.index;
    // console.log(visibleItems, 'visibleItems');
    // console.log(currentItemIndex, 'currentItemIndex');

    if(currentItemIndex !== currentIndex && currentItemIndex !== undefined){
       setCurrentIndex(currentItemIndex);
        flatListRef.current.scrollToIndex({ index: currentItemIndex, animated: false })
    }
  
  }, []);

  

  const viewabilityConfig = {
    waitForInteraction: true,
    viewAreaCoveragePercentThreshold: 50,

  }

  const renderItem = useCallback(
    ({ item, index }) => {
    return (
      <PostCard
        downloadURLs={(item?.downloadURLs && item?.downloadURLs) || []}
        index={index}
        post={item}
        caption={item?.caption}
        userName={item?.userName}
        name={item?.name}
        profilePic={item?.profilePic}
        savedPost={user?.savedPost}
        date={item?.updatedAt}
        user={user}
        navigation={navigation}
        currentIndex={currentIndex}
        location={item?.location}
        isPlay={currentIndex === index && shouldPlay}
      />
    )
  }, [currentIndex, shouldPlay]);


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
        renderItem={renderItem}
        onEndReached={() => fetchMore()}
        keyExtractor={(item) => item._id}
        onViewableItemsChanged={handleViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
        initialScrollIndex={currentIndex}
        onScroll={(e) => {
          // console.log(e.nativeEvent.contentOffset.y, 'e.nativeEvent.contentOffset.y');
          if(e.nativeEvent.contentOffset.y === 0){
            setCurrentIndex(0);
            // flatListRef.current.scrollToIndex({ index: 0, animated: false })
          }
        }}

      />
    </View>
  );
};

export default AllPosts;



import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions } from 'react-native';
import { Icon } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import { IconButton } from 'react-native-paper';  
import { Feather } from '@expo/vector-icons';
import VideoPlayerScreen from './VideoPlayerScreen';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Pressable } from 'react-native';

import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');

const Post = ({
  downloadURLs,
  index,
  post,
  uuid,
  caption,
  userName,
  name,
  profilePic,
  savedPost,
  date,
  likes,
  comments,
  user,
  navigation,
  currentIndex,
  location,
  isMuted, 
  setIsMuted,
  isPause,  
   setIsPause
}) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [places, setPlaces] = useState("");
    const [nowIndex, setNowIndex] = useState(0);
    
    const [showBottom, setShowBottom] = useState(false);
    const [showLottie, setShowLottie] = useState(false);

    const [lastPress, setLastPress] = useState(0);
    const [timer, setTimer] = useState(null);
    const [firstPress, setFirstPress] = useState(true);
  

    useEffect(() => {
      return () => {
          if (timer) {
              clearTimeout(timer);
          }
      };
      }, [timer]);

      

    useEffect(() => {
      (async () => {
        const lat = location?.coordinates[1]
        const lon = location?.coordinates[0];
        // const apiKey = "pk.4dd969766ea581f6c3cb31b810edd4b1";
        // const url = `https://api.locationiq.com/v1/reverse.php?key=${apiKey}&lat=${lat}&lon=${lon}&format=json`;
        const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${lat}&lon=${lon}&zoom=18&addressdetails=1`;
        const response = await fetch(url);
        const data = await response.json();
        if(data?.address?.city_district) {
          setPlaces(data?.address?.city_district + ", " + data?.address?.state);
        } else {
          setPlaces(data?.address?.city + ", " + data?.address?.state);
        }

      })();
    }, []);

  
    const onLikePress = () => {
      setLiked(!liked);
    };
  
    const onSavePress = () => {
      setSaved(!saved);
    };

    const onVideoEnd = () => {
      if(nowIndex < downloadURLs?.length - 1) {
        setInterval(() => {
          setNowIndex(nowIndex + 1);
        
        }, 5000);
      }
    }

    const onOnePress = () => {
      setIsPause(!isPause);
    }
    const onDoublePress = () => {
      setShowBottom(true);

      if(liked) {
        setLiked(false);
      } else {
        setLiked(true);
      }

      setShowLottie(true);
      setTimeout(() => {
        setShowLottie(false);
      }, 1000);

    }

     

    
  const handleButtonPress = useCallback(() => {
    const delta = new Date().getTime()
    const doublePressDelay = 300;
    if(firstPress) {
        setFirstPress(false);
        setTimer(setTimeout(() => {
            setFirstPress(true);
            setTimer(null);
            onOnePress()
        }, doublePressDelay));
        setLastPress(delta);
    } else {
        if(delta - lastPress < doublePressDelay) {
            clearTimeout(timer);
            setFirstPress(true);
             onDoublePress()
        }
    }
    }, [lastPress, timer, firstPress, onOnePress, onDoublePress]);

   

  
    const renderMedia = useCallback(() => (
      <Swiper style={styles.wrapper} showsButtons={false} loop={false} onIndexChanged={(index) => setNowIndex(index)} showsPagination={false} index={nowIndex}>
        {downloadURLs?.map((media, index2) => {
          if (media.type === "image") {
            return (
              <View key={index2} style={{ flex: 1 }}>
                <Image
                  key={index2}
                  style={styles.image}
                  source={{ uri: media.downloadURL }}
                />
                <View style={{ position : 'absolute', bottom : 10, right : 10, backgroundColor : 'white', padding : 5, borderRadius : 5, flexDirection : 'row', alignItems : 'center' }}>
                  <Text style={{ fontSize : 12, color : 'black' }}>{nowIndex + 1}/{downloadURLs?.length}</Text>
                </View>
             </View>
            );
          } else if (media.type === "video") {
            return (
              <View key={index2} style={{ flex: 1 }}>
                <VideoPlayerScreen
                  key={index2}
                  video={media.downloadURL}
                  currentIndex={currentIndex}
                  index={index}
                  nowIndex={nowIndex}
                  index2={index2}
                  isMuted={isMuted}
                  setIsMuted={setIsMuted}
                  onVideoEnd={onVideoEnd}
                  onDoublePress={onDoublePress}
                  onOnePress={onOnePress}
                  isPause={isPause}
                  setIsPause={setIsPause}
                  
                />
                 <View style={{ position : 'absolute', top : 20, right : 10, backgroundColor : 'white', padding : 5, borderRadius : 5, flexDirection : 'row', alignItems : 'center' }}>
                    <Text style={{ fontSize : 12, color : 'black' }}>{nowIndex + 1}/{downloadURLs?.length}</Text>
                  </View>
             </View>
            );
          }
        })}
      </Swiper>
    ), [downloadURLs, currentIndex, index, nowIndex, isMuted, setIsMuted, onVideoEnd, onDoublePress, onOnePress, isPause, setIsPause]);


    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Image
              style={styles.profilePic}
              source={{ uri: profilePic }}
            />
            <View style={styles.headerText}>
              <Text style={styles.userName}>{userName || name}</Text>
              <Text style={styles.location}>{places}</Text>
            </View>
          </View>
          <View style={styles.headerRight}>
            <IconButton
              icon="dots-vertical"
              color="black"
              size={20}
              onPress={() => navigation.navigate("PostOptions", { post })}
            />
          </View>
        </View>
        <Pressable onPress={handleButtonPress} style={{ flex: 1 }}>
          {renderMedia()}
        </Pressable>
        <TouchableOpacity onPress={() => setShowBottom(!showBottom)}>
          <View style={styles.caption}>
            <Text style={styles.captionText}>
              {caption}
            </Text>
          </View>
          <View style={styles.date}>
            <Text style={styles.dateText}>{moment(date).fromNow()}</Text>
          </View>
        </TouchableOpacity>
         {showBottom && (
          <View>
            <View style={styles.footer}>
              <View style={styles.footerLeft}>
                <View style={styles.footerIcons}>
                      <IconButton
                        icon="message-outline"
                        onPress={() => {}}
                        style={[styles.cardActionButton, styles.elevation]}
                      />
                    <IconButton
                      icon={({ color }) => (
                        <Feather name="send" size={22} color={color} />
                      )}
                      onPress={() => {}}
                      style={[styles.cardActionButton, styles.elevation]}
                    />
                    <IconButton
                        icon={saved ? "bookmark" : "bookmark-outline"}
                        color={saved ? "black" : "black"}
                        size={25}
                        onPress={onSavePress}
                        style={[styles.cardActionButton, styles.elevation]}
                    />
                </View>
              </View>
              <View style={styles.footerRight}>
                  <View style={styles.footerIcons}>
                      <IconButton
                        icon={liked ? "heart" : "heart-outline"}
                        color={liked ? "red" : "black"}
                        size={25}
                        onPress={onLikePress}
                        style={[styles.cardActionButton, styles.elevation]}
                      />
                  </View>
                </View>
            </View>
            <View style={styles.likes}>
              <Text style={styles.likesText}>
                {likes} {likes === 1 ? "like" : likes > 1 ? "likes" : ""}
              </Text>
            </View>
          </View>
         )}
         {showLottie && (
          <View style={styles.lottie}>
              <LottieView
                source={require("../../assets/lottie/twitter-favorite-heart.json")}
                autoPlay
                loop={false}
                speed={1.5}
                onAnimationFinish={() => setShowLottie(false)}
              />
            </View>
           )}

      </View>
    );
  };
  
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: "white",
      height: height * 0.8,
      width: width,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
    },
    headerLeft: {
      flexDirection: "row",
      alignItems: "center",
    },
    headerRight: {
      flexDirection: "row",
      alignItems: "center",
    },
    profilePic: {
      width: 40,
      height: 40,
      borderRadius: 20,
      marginRight: 10,
    },
    headerText: {
      flexDirection: "column",
    },
    userName: {
      fontWeight: "bold",
    },
    location: {
      color: "gray",
    },
   
    footer: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      padding: 10,
    },
    footerLeft: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-start",
    },
    footerRight: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "flex-end",
    },
    footerIcons: {
      flexDirection: "row",
      alignItems: "center",
      marginRight: 10,
      marginLeft: 10,
    },
    likes: {
      padding: 10,
    },
    likesText: {
      fontWeight: "bold",
    },
    caption: {
      paddingTop: 10,
      paddingLeft: 10,
      paddingRight: 10,
    },
    captionText: {
      fontWeight: "light",
    },
    comments: {
      padding: 10,
    },
    commentText: {
      fontWeight: "bold",
    },
    date: {
      padding: 10,
    },
    dateText: {
      color: "gray",
    },
    cardActionButton: {
      backgroundColor: "white",
      borderRadius: 50,
      padding: 5,
      margin: 5,
    },
    elevation: {
      elevation: 5,
      shadowOffset: {
        width: 2,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 3,
    },
    image: {
      flex: 1,
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    video: {
      flex: 1,
      width: "100%",
      height: "100%",
      resizeMode: "cover",
    },
    slide: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      backgroundColor: "transparent",
    },
    text: {
      color: "#fff",
      fontSize: 30,
      fontWeight: "bold",
    },
    paginationStyle: {
      position: "absolute",
      bottom: 10,
      right: 10,
    },
    paginationText: {
      color: "#fff",
      fontSize: 20,
    },
    lottie: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      justifyContent: "center",
      alignItems: "center",
      width: width,
      height: height * 0.6
    },
    wrapper: {
      zIndex: 1000
    }
  });

   
  

    
  
  export default Post;

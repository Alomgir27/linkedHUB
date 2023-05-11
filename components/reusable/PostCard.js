import React, { useState, useEffect, useCallback } from 'react';
import { View, StyleSheet, Image, Text, TouchableOpacity, Dimensions, Alert } from 'react-native';
import { Icon } from 'react-native-elements';
import Swiper from 'react-native-swiper';
import { IconButton } from 'react-native-paper';  
import { Feather } from '@expo/vector-icons';
import VideoPlayerScreen from './VideoPlayerScreen';
import moment from 'moment';
import { MaterialCommunityIcons } from '@expo/vector-icons';

import LottieView from 'lottie-react-native';

const { width, height } = Dimensions.get('window');
import { useDispatch } from 'react-redux';
import { useSelector } from 'react-redux';

import BottomSheet from './BottomSheet';
import BottomSheetComment from './CommentBottomSheet';

import axios from 'axios';

import { baseURL } from '../config/baseURL';

const Post = ({
  downloadURLs,
  post,
  caption,
  userName,
  name,
  profilePic,
  date,
  user,
  navigation,
  location,
  isPlay
}) => {
    const [liked, setLiked] = useState(false);
    const [saved, setSaved] = useState(false);
    const [places, setPlaces] = useState("");
    const [nowIndex, setNowIndex] = useState(0);
    
    const [showBottom, setShowBottom] = useState(false);
    const [showLottie, setShowLottie] = useState(false);
    const [likes, setLikes] = useState(post?.likes);
    const [users, setUsers] = useState([]);

    const [videoPlaying, setVideoPlaying] = useState(true);

    

    const [lastPress, setLastPress] = useState(0);
    const [timer, setTimer] = useState(null);
    const [firstPress, setFirstPress] = useState(true);

    const dispatch = useDispatch();



    const bottomSheetModalRef = React.useRef(null);
    const bottomSheetModalRefComment = React.useRef(null);

    useEffect(() => {
      if(likes?.includes(user?.uuid)) {
        setLiked(true);
      } else {
        setLiked(false);
      }
    }, [likes]);
  

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
        } else if(data?.address?.city){
          setPlaces(data?.address?.city + ", " + data?.address?.state);
        }
        else if(data?.address?.state) {
          setPlaces(data?.address?.state);
        }
        else {
          setPlaces("Unknown");
        }
      })();
    }, [location?.coordinates]);

  
    const onLikePress = () => {
      setLiked(!liked);
    };
  
    const onSavePress = () => {
      setSaved(!saved);
    };

    const handlePresentModalPress = useCallback(() => {
      bottomSheetModalRef.current?.present();
      setVideoPlaying(false);
      (async () => {
        await axios.post(`${baseURL}/api/users/getUsersByUUIDs`, {
          uuids: likes
        })
        .then((res) => {
          setUsers(res?.data?.users);
        })
        .catch((err) => {
          console.log(err);
        });
      })();
    }, [likes]);

    const fetchUsers = async () => {
      await axios.post(`${baseURL}/api/users/getUsersMoreByUUIDs`, {
        uuids: likes,
        lastUser: users[users.length - 1],
      })
      .then((res) => {
        setUsers([...users, ...res?.data?.users]);
      })
      .catch((err) => {
        console.log(err);
      });
    }

    const handlePresentModalPressComment = useCallback(() => {
      bottomSheetModalRefComment.current?.present();
      setVideoPlaying(false);
    }, []);

    const handleSheetChanges = useCallback((index) => {
      console.log('handleSheetChanges', index);
      if(index === -1) {
        console.log("Sheet Closed");
        setVideoPlaying(true);
      }
    }, []);

    const handleSheetChangesComment = useCallback((index) => {
      console.log('handleCommentSheetChanges', index);
      if(index === -1) {
        console.log("Comment Sheet Closed");
        setVideoPlaying(true);
        
      }
    }, []);
   

 
    const onDoublePress = async () => {
      setShowBottom(true);

      if(liked) {
        setLiked(false);
        await axios.post(`${baseURL}/api/posts/unlikePost`, {
          postId : post?._id,
          uuid : user?.uuid
        })
        .then((res) => {
          console.log(res.data);
          const { post } = res.data;
          console.log(post);
          dispatch({ type : 'UPDATE_POST', post : post });
          setLikes(post?.likes);

        })
        .catch((err) => {
          console.log(err);
        })
      } else {
        setLiked(true);
        await axios.post(`${baseURL}/api/posts/likePost`, {
          postId : post?._id,
          uuid : user?.uuid
        })
        .then((res) => {
          console.log(res.data);
          const { post } = res.data;
          console.log(post);
          dispatch({ type : 'UPDATE_POST', post : post });
          setLikes(post?.likes);
        })
        .catch((err) => {
          console.log(err);
        })
      }

      setShowLottie(true);
      setTimeout(() => {
        setShowLottie(false);
      }, 1000);

    }

    const onOnePress = () => {
      setShowBottom(!showBottom);
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

   

  
    const renderMedia = () => (
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
                  index={index2}
                  nowIndex={nowIndex}
                  isPlay={videoPlaying && isPlay}
                  onDoublePress={onDoublePress}
                />
                 <View style={{ position : 'absolute', top : 20, right : 10, backgroundColor : 'white', padding : 5, borderRadius : 5, flexDirection : 'row', alignItems : 'center' }}>
                    <Text style={{ fontSize : 12, color : 'black' }}>{nowIndex + 1}/{downloadURLs?.length}</Text>
                  </View>
             </View>
            );
          }
        })}
      </Swiper>
    );


    return (
    <>
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
        <View style={{ flex: 1 }}>
          {renderMedia()}
        </View>
        <TouchableOpacity onPress={() => setShowBottom(!showBottom)}>
          <View style={styles.caption}>
            <Text style={styles.captionText}>
              {caption ? caption : "No Caption"}
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
                        onPress={handlePresentModalPressComment}
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
              <TouchableOpacity onPress={handlePresentModalPress} style={styles.likesText}>
                <Text style={styles.likesText}>
                  {likes?.length > 0 ? likes?.length : null } {likes?.length === 1 ? "like" : likes?.length > 1 ? "likes" : ""}
                </Text>
              </TouchableOpacity>
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
        <BottomSheet
        title="Loved by"
        bottomSheetModalRef={bottomSheetModalRef}
        users={users}
        handleSheetChanges={handleSheetChanges}
        handlePresentModalPress={handlePresentModalPress}
        fetchUsers={fetchUsers}
        navigation={navigation}
      />
       <BottomSheetComment
        title="Comments"
        bottomSheetModalRef={bottomSheetModalRefComment}
        handleSheetChanges={handleSheetChangesComment}
        navigation={navigation}
        postId={post?._id}
      />
      </>
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

import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { View, StyleSheet, Dimensions, Image , TouchableOpacity, Text, SafeAreaView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import moment from 'moment';
import axios from 'axios';
import { baseURL } from '../config/baseURL';
import { ScrollView } from 'react-native-gesture-handler';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import {
    USERS_STORY_BY_UUID_DATA_STATE_CHANGE
}
from '../redux/constant/index';
import { Colors, ProgressBar } from 'react-native-paper';

import { useDispatch } from 'react-redux';

import { useSelector } from 'react-redux';

import LottieView from 'lottie-react-native';

import BottomSheet from './BottomSheet';




const { width, height } = Dimensions.get('window');

const StoryViewer = ({route,  navigation }) => {
    

  const [stories, setStories] = useState(route.params?.stories || []);
  const [animation, setAnimation] = useState(false);
  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);
  const [isLove, setIsLove] = useState(false);
  const [isSheetOpen, setIsSheetOpen] = useState(false);
  const bottomSheetModalRef = useRef(null);
  const [lastTap, setLastTap] = useState(null);
  const [likedBy, setLikedBy] = useState([]);

  const [lastPress, setLastPress] = useState(0);
  const [timer, setTimer] = useState(null);
  const [firstPress, setFirstPress] = useState(true);

;



  const [users, setUsers] = useState([]);

  const dispatch = useDispatch();

  const user = useSelector(state => state?.data?.currentUser);

  useEffect(() => {    
    if(!stories[currentStoryIndex]) {
      navigation.goBack();
    }
  }, [stories]);

  
  useEffect(() => {
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
    };
    }, [timer])
 


  useEffect(() => {
    setStories(route.params?.stories || []);
  }, [route.params?.stories]);

    useEffect(() => {
        (async () => {
              await axios.post(`${baseURL}/api/stories/viewed`, {
                storyId: stories[currentStoryIndex]._id,
                uuid: stories[currentStoryIndex].uuid,
            })
            .then((res) => {
                console.log(res.data);
            })
            .catch((err) => {
                console.log(err);
            });
        })();
    }, [currentStoryIndex]);

   

    useEffect(() => {
        setIsLove(stories[currentStoryIndex]?.likedBy?.includes(user?.uuid));
    }, [currentStoryIndex, stories]);

    useEffect(() => {
        setLikedBy(stories[currentStoryIndex]?.likedBy);
    }, [currentStoryIndex, stories]);


    useEffect(() => {
      // if bottom sheet is presented clear interval
      if (isSheetOpen) {
        return;
      }
        const interval = setInterval(() => {
            if (currentStoryIndex < stories.length - 1) {
                setCurrentStoryIndex(currentStoryIndex + 1);
                setUsers([]);
            }
            
        }, 10000);
        return () => clearInterval(interval);
    }, [currentStoryIndex, isSheetOpen]);


  const handleLove = () => {
    if(!isLove) {
      setAnimation(true);
      setTimeout(() => {
        setAnimation(false);
      }, 1500);
    }

    if (isLove) {
        (async () => {
            await axios.post(`${baseURL}/api/stories/unliked`, {
                storyId: stories[currentStoryIndex]._id,
                uuid: user?.uuid,
            })
            .then((res) => { 
                setIsLove(false);
                const { uuid } = stories[currentStoryIndex];
                let newStories = stories;
                newStories[currentStoryIndex].likedBy = newStories[currentStoryIndex].likedBy.filter((item) => item !== user?.uuid);
                dispatch({ type: USERS_STORY_BY_UUID_DATA_STATE_CHANGE, uuid, usersStoryByUUID: newStories });
                setStories(newStories);
                setLikedBy(newStories[currentStoryIndex]?.likedBy);
                

            })
            .catch((err) => {
                console.log(err);
            });
        })();
    } else {
        (async () => {
            await axios.post(`${baseURL}/api/stories/liked`, {
                storyId: stories[currentStoryIndex]._id,
                uuid: user?.uuid,
            })
            .then((res) => {
                setIsLove(true);
                const { uuid } = stories[currentStoryIndex];
                const newStories = stories;
                newStories[currentStoryIndex].likedBy.push(user?.uuid);
                dispatch({ type: USERS_STORY_BY_UUID_DATA_STATE_CHANGE, uuid, usersStoryByUUID: newStories });
                setStories(newStories);
                setLikedBy(newStories[currentStoryIndex]?.likedBy);
              
            })
            .catch((err) => {
                console.log(err);
            });
        })();
    }
  };

  
  if(!stories.length) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: 'white'}}>
        <Text style={{fontSize: 20, fontWeight: 'bold'}}>No Stories</Text>
      </View>
    )
  }


   




  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
      setUsers([]);
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
      setUsers([]);
    }
  };

  const onDoublePress = () => {
    handleLove();
  }

  const onOnePress = () => {
    navigation.navigate('FullScreenPicture',  { image : stories[currentStoryIndex], isStory: true });
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


  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
    setIsSheetOpen(true);
    (async () => {
      await axios.post(`${baseURL}/api/users/getUsersByUUIDs`, {
        uuids: likedBy,

      })
      .then((res) => {
        setUsers(res?.data?.users);
      })
      .catch((err) => {
        console.log(err);
      });
    })();
  }, [likedBy]);

  const fetchUsers = async () => {
    await axios.post(`${baseURL}/api/users/getUsersMoreByUUIDs`, {
      uuids: likedBy,
      lastUser: users[users.length - 1],
    })
    .then((res) => {
      setUsers([...users, ...res?.data?.users]);
    })
    .catch((err) => {
      console.log(err);
    });
  }

  const handleSheetChanges = useCallback((index) => {
    console.log('handleSheetChanges', index);
    if(index === -1) {
      setIsSheetOpen(false);
    }
  }, []);

 
  const lovedCount = (length) => {
    if(length === 0) {
      return ""
    } else if(length < 1000) {
      return length
    } else if(length >= 1000 && length < 1000000) {
      return `${(length / 1000).toFixed(1)}K`
    } else if(length >= 1000000 && length < 1000000000) {
      return `${(length / 1000000).toFixed(1)}M`
    } else if(length >= 1000000000 && length < 1000000000000) {
      return `${(length / 1000000000).toFixed(1)}B`
    } else if(length >= 1000000000000 && length < 1000000000000000) {
      return `${(length / 1000000000000).toFixed(1)}T`
    }
  }

  return (
      <SafeAreaView style={styles.container}>
          <View style={styles.storyHeaderContainer}>
              <View style={{ flexDirection: 'row' }}>
                  <Image source={{ uri: stories[currentStoryIndex]?.profilePic }} style={styles.storyHeaderImage} />
                  <View style={{ justifyContent: 'center', marginTop: 5 }}>
                      <Text style={{ color: 'white', fontWeight: 'bold' }}>{stories[currentStoryIndex]?.name}</Text>
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: 'light'}}>{stories[currentStoryIndex]?.userName}</Text>
                      <Text style={{ color: 'gray', fontSize: 10 }}>{moment(stories[currentStoryIndex]?.createdAt).fromNow()}</Text>
                  </View>

              </View>
            
              <View style={{ flexDirection: 'row' }}>
                  <TouchableOpacity onPress={() => navigation.goBack()} style={{  alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(128,128,128,0.5)' }}>
                      <MaterialCommunityIcons name="close" size={20} color="white" />
                  </TouchableOpacity>
              </View>
          </View>
          
        <TouchableOpacity onPress={handleButtonPress} activeOpacity={1} style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
              <Image style={styles.image} source={{ uri: stories[currentStoryIndex]?.image }}  />
          </TouchableOpacity>

          <TouchableOpacity onPress={handlePreviousStory} style={{ position: 'absolute', left: 0, alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <Icon name="chevron-left" size={20} color="white" />
          </TouchableOpacity>

        <TouchableOpacity onPress={handleNextStory} style={{ position: 'absolute', right: 0, alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)' }}>
              <Icon name="chevron-right" size={20} color="white" />
          </TouchableOpacity>

          {animation && (
              <View style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, alignItems: 'center', justifyContent: 'center' }}>
                  <LottieView source={require('../../assets/lottie/love-icon-animation.json')} autoPlay loop={false} />
              </View>
          )}


          <TouchableOpacity onPress={handleLove} style={styles.loveButton}>
              <MaterialCommunityIcons name={isLove ? "heart" : "heart-outline"} size={32} color={isLove ? "red" : "white"} />
              {isLove && (
                  <View style={styles.loveButtonActiveBorder} >
                      <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold', color: 'white' }}>{lovedCount(stories[currentStoryIndex]?.likedBy?.length)}</Text>
                  </View>
              )}
          </TouchableOpacity>
          <TouchableOpacity onPress={handlePresentModalPress} style={styles.seeAllUsersButtonWhoLoved}>
            {lovedCount(stories[currentStoryIndex]?.likedBy?.length) > 0 && (
              <Text style={{ color: 'white', fontSize: 12, fontWeight: 'bold' }}>{lovedCount(stories[currentStoryIndex]?.likedBy?.length)} {lovedCount(stories[currentStoryIndex]?.likedBy?.length) === 1 ? "person" : "people"} loved this</Text>
            )}

          </TouchableOpacity>


          

          <View style={styles.navContainer}>
              <View style={{ flexDirection: 'row' }}>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                      {stories && stories?.map((story, index) => (
                          <TouchableOpacity key={story._id} onPress={() => setCurrentStoryIndex(index)} style={{ marginHorizontal: 5 }}>
                              <Image source={{ uri: story?.image }} style={styles.storyImage} />
                              {index === currentStoryIndex && (
                                  <View style={styles.storyImageActiveBorder} />
                              )}
                          </TouchableOpacity>
                      ))}
                  </ScrollView>
              </View>
          </View>
          <BottomSheet
              title="Loved by"
              bottomSheetModalRef={bottomSheetModalRef}
              users={users}
              handleSheetChanges={handleSheetChanges}
              handlePresentModalPress={handlePresentModalPress}
              navigation={navigation}
              fetchUsers={fetchUsers}
            />

         
      </SafeAreaView> 
    );
};



const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 30,
  },
  image: {
    width: width,
    height: height,
    resizeMode: 'contain',
  },
  navContainer: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  navButton: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: 'white',
    marginHorizontal: 5,
  },
    storyImage: {
    width: 50,
    height: 50,
    borderRadius: 50,
    },
    storyImageActiveBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 50,
    },
    storyHeaderContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    zIndex: 1,
    },
    storyHeaderImage: {
    width: 40,
    height: 40,
    borderRadius: 40,
    marginRight: 10,
    marginTop: 10,
    },
    storyHeaderText: {
    color: 'white',
    fontSize: 16,
    },
    loveButton: {
    position: 'absolute',
    bottom: 100,
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    },
    loveButtonActiveBorder: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderWidth: 2,
    borderColor: 'white',
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    },
    seeAllUsersButtonWhoLoved: {
    bottom: 10,
    left: 0,
    right: 0,
    },


    
});

export default StoryViewer;


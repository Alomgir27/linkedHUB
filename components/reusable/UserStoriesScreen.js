
import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Dimensions, Image , TouchableOpacity, Text, SafeAreaView, Alert} from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { MaterialCommunityIcons } from 'react-native-vector-icons';
import moment from 'moment';
import axios from 'axios';
import { baseURL } from '../config/baseURL';
import { ScrollView } from 'react-native-gesture-handler';

const { width, height } = Dimensions.get('window');

const StoryViewer = ({route,  navigation }) => {
    
  const { stories } = route.params;

  const [currentStoryIndex, setCurrentStoryIndex] = useState(0);

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
        const interval = setInterval(() => {
            if (currentStoryIndex < stories.length - 1) {
                setCurrentStoryIndex(currentStoryIndex + 1);
            }
        }, 5000);
        return () => clearInterval(interval);
    }, [currentStoryIndex]);




  const handlePreviousStory = () => {
    if (currentStoryIndex > 0) {
      setCurrentStoryIndex(currentStoryIndex - 1);
    }
  };

  const handleNextStory = () => {
    if (currentStoryIndex < stories.length - 1) {
      setCurrentStoryIndex(currentStoryIndex + 1);
    }
  };

  const handleStoryPress = () => {
    // Open the current story in full-screen mode
    const currentStory = stories[currentStoryIndex];
    navigation.navigate('FullScreenStory', { story: currentStory });    
    };

  return (
    <SafeAreaView style={styles.container}>
        
        <View style={styles.storyHeaderContainer}>
            <View style={{ flexDirection: 'row' }}>
                <Image source={{ uri: stories[currentStoryIndex].profilePic }} style={styles.storyHeaderImage} />
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
        
       <TouchableOpacity onPress={handleStoryPress}>
            <Image style={styles.image} source={{ uri: stories[currentStoryIndex].image }}  />
        </TouchableOpacity>

        <TouchableOpacity onPress={handlePreviousStory} style={{ position: 'absolute', left: 0, alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <Icon name="chevron-left" size={20} color="white" />
        </TouchableOpacity>

      <TouchableOpacity onPress={handleNextStory} style={{ position: 'absolute', right: 0, alignItems: 'center', justifyContent: 'center', width: 50, height: 50, borderRadius: 25, backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <Icon name="chevron-right" size={20} color="white" />
        </TouchableOpacity>

        <View style={styles.navContainer}>
            <View style={{ flexDirection: 'row' }}>
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {stories.map((story, index) => (
                        <TouchableOpacity key={story._id} onPress={() => setCurrentStoryIndex(index)} style={{ marginHorizontal: 5 }}>
                            <Image source={{ uri: story.image }} style={styles.storyImage} />
                            {index === currentStoryIndex && (
                                <View style={styles.storyImageActiveBorder} />
                            )}
                        </TouchableOpacity>
                    ))}
                </ScrollView>

               
            </View>
        </View>

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
    zIndex: 100,
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
    
});

export default StoryViewer;


import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableOpacity, Dimensions, TouchableWithoutFeedback, Alert } from 'react-native';
import { StatusBar } from 'react-native';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import moment from 'moment';


const { width, height } = Dimensions.get('window');

export default function VideoPlayer({  video, index, isPlay, nowIndex, onDoublePress }) {
  const [status, setStatus] = useState({});
  const [showControls, setShowControls] = useState(false);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(false);

  const [lastPress, setLastPress] = useState(0);
  const [timer, setTimer] = useState(null);
  const [firstPress, setFirstPress] = useState(true);

  const videoRef = useRef(null);


  useEffect(() => {
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
    };
    }, [timer]);

  

 useEffect(() => {
    //if video is ended, set isPlaying to false
    if (status.didJustFinish) {
      setIsPlaying(false);
      if(videoRef.current) {
        //set video to start
        videoRef.current.setPositionAsync(0);
      }
    }
  }, [status?.didJustFinish]);

 useEffect(() => {
    if (videoRef.current) {
      videoRef.current.getStatusAsync().then((playbackStatus) => {
        setStatus(playbackStatus);
      });
    }
  }, [videoRef.current]);

useEffect(() => {
    if (videoRef.current) {
      if(isMuted) {
        videoRef.current.setIsMutedAsync(true);
      } else {
        videoRef.current.setIsMutedAsync(false);
      }
    }
  }, [isMuted]);
  

  const showControlsTimeout = () => {
    setShowControls(true);
    setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };



  const togglePlayPause = () => {
    if(isPlaying) {
      setIsPlaying(false);
    } else {
      setIsPlaying(true);
    }
  };


  const toggleMute = () => {
    if(isMuted) {
      setIsMuted(false);
    } else {
      setIsMuted(true);
    }
  };

  const handleButtonPress = useCallback(() => {
    const delta = new Date().getTime()
    const doublePressDelay = 300;
    if(firstPress) {
        setFirstPress(false);
        setTimer(setTimeout(() => {
            setFirstPress(true);
            setTimer(null);
            showControlsTimeout();
        }, doublePressDelay));
        setLastPress(delta);
    } else {
        if(delta - lastPress < doublePressDelay) {
            clearTimeout(timer);
            setFirstPress(true);
            setTimer(null);
            onDoublePress && onDoublePress();
        }
    }
    }, [lastPress, timer, firstPress]);



  const onReadyForDisplay = () => {
    if (videoRef.current) {
      videoRef.current.getStatusAsync().then((playbackStatus) => {
        setStatus(playbackStatus);
      });
    }
  };



  return (
    <View style={styles.container}>
      <TouchableWithoutFeedback onPress={handleButtonPress}>
        <Video
            ref={videoRef}
            source={{ uri:  video }}
            rate={1.0}
            volume={1.0}
            isMuted={isMuted}
            resizeMode="cover"
            useNativeControls={false}
            style={styles.videoPlayer}
            shouldPlay={isPlaying && isPlay && index === nowIndex}
            onReadyForDisplay={onReadyForDisplay}
            isLooping={false}
            onPlaybackStatusUpdate={(status) => setStatus(() => status)}
          />
      </TouchableWithoutFeedback> 
        {showControls && (
           <View style={{ position: 'absolute', left: width / 2 - 50, top: height * 0.5 / 2 - 10, transition: 'all 0.5s', opacity: 0.5}}>
               <View style={styles.isBuffering} />
            </View>
         )}
        <TouchableOpacity onPress={toggleMute} style={styles.playPauseButton}>
              <MaterialIcons name={isMuted ? 'volume-off' : 'volume-up'} size={24} color="white" />
          </TouchableOpacity>
          {showControls && (
            <TouchableOpacity onPress={togglePlayPause} style={styles.playButton}>
              <MaterialIcons name={isPlaying ? 'pause' : 'play-arrow'} size={30} color="white" />
            </TouchableOpacity>
          )}

    </View>
  );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },
    videoPlayer: {
        width: width,
        height: height + StatusBar.currentHeight,
        resizeMode: 'cover',
    },
    playPauseButton: {
        position: 'absolute',
        backgroundColor: 'transparent',
        width: 50,
        height: 50,
        borderRadius: 25,
        right: 10,
        bottom: 20,
        justifyContent: 'center',
        alignItems: 'center',
    },
    isBuffering: {
        position: 'absolute',
        backgroundColor: "#292929",
        justifyContent: 'center',
        alignItems: 'center',
        elevation: 5,
        opacity: 0.5,
        zIndex: 2,
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        borderRadius: 50,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        width: 100,
        height: 100
        
    },
    playButton: {
        position: 'absolute',
        backgroundColor: 'transparent',
        width: 50,
        height: 50,
        borderRadius: 25,
        left: width / 2 - 25,
        top: height * 0.6 / 2 - 25,
        justifyContent: 'center',
        alignItems: 'center',
    },
    videoContainer: {
        flex: 1,
        backgroundColor: 'transparent',
        justifyContent: 'center',
    },

    

});




 
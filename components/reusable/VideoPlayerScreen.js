import React, { useState, useRef, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, Pressable, TouchableOpacity, Dimensions } from 'react-native';
import { Video } from 'expo-av';
import { MaterialIcons } from '@expo/vector-icons';

import { MaterialCommunityIcons } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');

export default function VideoPlayer({ onOnePress, onDoublePress, onVideoEnd, downloadURL, index, currentIndex, nowIndex, index2, isMuted, setIsMuted, isPause, setIsPause }) {
  const [status, setStatus] = useState({});
  const [volume, setVolume] = useState(1.0);
  const [showControls, setShowControls] = useState(false);

  const videoRef = useRef(null);

  const [lastPress, setLastPress] = useState(0);
  const [timer, setTimer] = useState(null);
  const [firstPress, setFirstPress] = useState(true);



  useEffect(() => {
    console.log('index', index, 'currentIndex', currentIndex, 'nowIndex', nowIndex, 'index2', index2)
   if(videoRef.current) {
    if(index === currentIndex && index2 === nowIndex) {
      videoRef.current.playAsync();
    } else {
      videoRef.current.pauseAsync();
    }
    }
  }, [currentIndex, index, videoRef, nowIndex, index2])

  useEffect(() => {
    if(isPause) {
      setShowControls(true);
      setTimeout(() => {
        setShowControls(false);
      }, 2000);
      if(videoRef.current) {
        videoRef.current.pauseAsync();
      }
    } else {
      if(videoRef.current) {
        videoRef.current.playAsync();
      }
    }
  }, [isPause])




  useEffect(() => {
    return () => {
        if (timer) {
            clearTimeout(timer);
        }
    };
    }, [timer]);

  

  const handleButtonPress = useCallback(() => {
    const delta = new Date().getTime()
    const doublePressDelay = 300;
    if(firstPress) {
        setFirstPress(false);
        setTimer(setTimeout(() => {
            setFirstPress(true);
            setTimer(null);
            onOnePress ? onOnePress() : togglePlayPause();
        }, doublePressDelay));
        setLastPress(delta);
    } else {
        if(delta - lastPress < doublePressDelay) {
            clearTimeout(timer);
            setFirstPress(true);
            onDoublePress ? onDoublePress() : toggleFullscreen();
        }
    }
    }, [lastPress, timer, firstPress, onOnePress, onDoublePress]);

 

  const togglePlayPause = async () => {
    const { isPlaying } = status;
    if (videoRef.current) {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setStatus(prevStatus => ({ ...prevStatus, isPlaying: !isPlaying }));
    }
  };

  const toggleMute = () => {
    setIsMuted(prevIsMuted => !prevIsMuted);
  };

  const onPlaybackStatusUpdate = playbackStatus => {
    setStatus(prevStatus => ({
      ...prevStatus,
      positionMillis: playbackStatus.positionMillis,
      durationMillis: playbackStatus.durationMillis,
      isPlaying: playbackStatus.isPlaying,
      isBuffering: playbackStatus.isBuffering,
      isLooping: playbackStatus.isLooping,
      didJustFinish: playbackStatus.didJustFinish,
    }));

    if (playbackStatus.didJustFinish) {
      onVideoEnd ? onVideoEnd() : null;
    }
  };

  const toggleFullscreen = () => {
    if (videoRef.current) {
      videoRef.current.presentFullscreenPlayer();
    }
  };



  return (
    <View style={styles.container}>
        <Pressable onPress={handleButtonPress}>
          <Video
            ref={videoRef}
            source={{ uri: 'https://storage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' }}
            rate={1.0}
            volume={volume}
            isMuted={isMuted}
            resizeMode="cover"
            shouldPlay={index === currentIndex}
            useNativeControls={false}
            onPlaybackStatusUpdate={onPlaybackStatusUpdate}
            style={styles.videoPlayer}
          />
        </Pressable>
        <TouchableOpacity onPress={toggleMute} style={styles.playPauseButton}>
            <MaterialIcons name={isMuted ? 'volume-off' : 'volume-up'} size={24} color="black" />
        </TouchableOpacity>
        {showControls && (
          isPause ? (
            <MaterialCommunityIcons name="play-circle" size={50} color="white" style={{position: 'absolute', left: width / 2 - 25, top: height * 0.6 / 2 - 25, transition: 'all 0.5s'}} />
          ) : (
            <MaterialCommunityIcons name="pause-circle" size={50} color="white" style={{position: 'absolute', left: width / 2 - 25, top: height * 0.6 / 2 - 25, transition: 'all 0.5s'}} />
          )
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
        height: height * 0.6,
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
});




 
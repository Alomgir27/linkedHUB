import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import Video from 'react-native-video';

import { Camera } from 'expo-camera';

export default function ShortVideo() {
  const [isRecording, setIsRecording] = useState(false);
  const [videoUri, setVideoUri] = useState(null);

  const startRecording = async () => {
    setIsRecording(true);
    const { uri } = await camera.recordAsync();
    setVideoUri(uri);
  };

  const stopRecording = () => {
    setIsRecording(false);
    camera.stopRecording();
  };

  return (
    <View style={styles.container}>
      {videoUri ? (
        <Video source={{ uri: videoUri }} style={styles.video} />
      ) : (
        // <Camera
        //     ref={(ref) => (camera = ref)}
        //     style={styles.camera}
        //     type={Camera.Constants.Type.back}
        //     ratio={'16:9'}
        //     videoStabilizationMode={Camera.Constants.VideoStabilization.cinematic}
        //     onRecordingStart={() => console.log('recording started')}
        //     onRecordingEnd={() => console.log('recording ended')}
        //     />
        null
       
      )}
      {!videoUri && (
        <TouchableOpacity
          onPress={isRecording ? stopRecording : startRecording}
          style={styles.recordButton}
        >
          <View
            style={[
              styles.recordButtonInner,
              { backgroundColor: isRecording ? 'red' : 'white' },
            ]}
          />
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  video: {
    flex: 1,
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    borderWidth: 3,
    borderColor: 'white',
    alignSelf: 'center',
    position: 'absolute',
    bottom: 40,
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    margin: 5,
  },
});

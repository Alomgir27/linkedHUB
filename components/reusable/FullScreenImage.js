import React from 'react';
import { StyleSheet, View, Image, TouchableOpacity, Text} from 'react-native';
import { MaterialCommunityIcons } from 'react-native-vector-icons';




const FullScreenStory = ({ navigation, route }) => {
  const { image } = route.params;


  return (
    <View style={styles.container}>
        <View style={styles.storyHeaderContainer}>
            <View style={{ flexDirection: 'row' }}>
                <TouchableOpacity onPress={() => navigation.goBack()}>
                    <MaterialCommunityIcons name="close" size={30} color="white" />
                </TouchableOpacity>
            </View>
        </View>

      <TouchableOpacity onPress={() => navigation.goBack()}>
        <Image style={styles.image} source={{ uri: image?.image }} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
    justifyContent: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
    storyHeaderContainer: {
        position: 'absolute',
        top: 40,
        right: 0,
        height: 50,
        marginRight: 10,
        backgroundColor: 'rgba(0,0,0,0.5)',
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 10,
        zIndex: 100,
    },

    
});

export default FullScreenStory;

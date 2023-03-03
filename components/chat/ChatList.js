import React, { useState, useEffect} from 'react'
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Image, KeyboardAvoidingView, Alert, ImageBackground, FlatList } from 'react-native'


import Stories from '../reusable/Stories';


import { MaterialCommunityIcons } from 'react-native-vector-icons';

import firebase from '../../firebase'

import { Appbar } from 'react-native-paper';

import { Ionicons, Feather } from '@expo/vector-icons';

import moment from 'moment';

import { Header } from 'react-native-elements';
import { Avatar } from 'react-native-elements';
import { ListItem } from 'react-native-elements';
import { Card } from 'react-native-elements';
import { Icon } from 'react-native-elements';
import { Input } from 'react-native-elements';
import { Overlay } from 'react-native-elements';
import { Slider } from 'react-native-elements';
import { CheckBox } from 'react-native-elements';
import { SearchBar } from 'react-native-elements';
import { Rating } from 'react-native-elements';
import { AirbnbRating } from 'react-native-elements';
import { Badge } from 'react-native-elements';
import { PricingCard } from 'react-native-elements';
import { Tile } from 'react-native-elements';
import { SocialIcon } from 'react-native-elements';
import { Divider } from 'react-native-elements';
import { Text as TextElement } from 'react-native-elements';
import { useSelector } from 'react-redux';

import { AntDesign } from '@expo/vector-icons';

import axios from 'axios';

import { baseURL } from '../config/baseURL';


function ChatList({ navigation }) {
  const [connectedUsers, setConnectedUsers] = useState([]);
  const [text, setText] = useState('');


  const [chatList, setChatList] = useState([
    {
        id: '1',
        name: 'Vicky',
        image: 'https://i.pravatar.cc/150?img=3',
        lastMessage: 'Hey, how are you?',
        timestamp: Date.now(),
        seen: false,
    },
    {
        id: '2',
        name: 'Rich',
        image: 'https://i.pravatar.cc/150?img=2',
        lastMessage: 'Hey, how are you?',
        timestamp: Date.now(),
        seen: false,
    },
    {
        id: '3',
        name: 'Bret',
        image: 'https://i.pravatar.cc/150?img=6',
        lastMessage: 'Hey, how are you?',
        timestamp: Date.now(),
        seen: false,
    }
  ])
  const [backgroundColor, setBackgroundColor] = useState("#fff")


  

    

  

  const handleSearch = (text) => {
    const formattedQuery = text.toLowerCase();
    const filteredData = connectedUsers.filter(user => {
      return contains(user, formattedQuery);
    });
    setChatList(filteredData);
    setText(text);
  };

  const contains = ({ chatName }, query) => {
    if (chatName.includes(query)) {
      return true;
    }
    return false;
  };

  const handleSend = () => {
    if (text) {
      firebase
        .database()
        .ref('users')
        .push({
          chatName: text,
          photoURL: 'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
        })
        .then(() => setText(''))
        .catch((error) => console.log(error));
    }
  };

  





  return (
    <View style={[styles.containerBox, { backgroundColor : backgroundColor}]}>
      <Appbar.Header style={{backgroundColor: backgroundColor}}>
        <Appbar.BackAction onPress={() => navigation.navigate('HomeScreen')} />
        <Appbar.Content title="Chats" />
        <Appbar.Action icon="dots-vertical" onPress={() => navigation.navigate('Settings')} />
      </Appbar.Header>


      <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
        <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', backgroundColor: '#eee', padding: 5, borderRadius: 25}}>
          <Ionicons name="ios-search" size={24} color="black" style={{marginLeft: 5}} />
          <TextInput placeholder="Search" style={{flex: 1, marginLeft: 10}} />
        </View>

        <TouchableOpacity style={{marginLeft: 10}}>
          <Ionicons name="ios-qr-code" size={24} color="black" 
          onPress={() => Alert.alert('QR Code', 'This feature is not available yet.')} />
        </TouchableOpacity>
        
      </View>

      <View style={{flexDirection: 'row', alignItems: 'center', padding: 10, borderBottomWidth: 1, borderBottomColor: '#ccc'}}>
        <Stories navigation={navigation}  />
      </View>

      
      
      <View style={styles.container}>
          <View style={styles.listContainer}>
            <FlatList
              data={chatList}
              renderItem={({ item }) => (
                <ListItem
                  bottomDivider
                  onPress={() => {
                    navigation.navigate('Chat', {
                      id: item.id,
                      chatName: item.chatName,
                    });
                  }}
                >
                  <Avatar
                    rounded
                    source={{
                      uri:
                        item?.image ||
                        'https://cencup.com/wp-content/uploads/2019/07/avatar-placeholder.png',
                    }}
                  />
                  <ListItem.Content>
                    <ListItem.Title style={{ fontWeight: '800' }}>
                      {item?.name } 
                    </ListItem.Title>
                    <ListItem.Subtitle numberOfLines={1} ellipsizeMode="tail">
                      {item?.seen ? (
                        <Text style={{ color: 'grey' }}>
                          {item?.lastMessage }  {moment(item?.timestamp).format('LT')}
                        </Text>
                      ) : (
                        <Text style={{ color: 'green' }}>
                          {item?.lastMessage }  {moment(item?.timestamp).format('LT')}
                        </Text>
                      )}
                    </ListItem.Subtitle>
                  </ListItem.Content>
                </ListItem>
              )}
            />
          </View>
        </View>
    </View>
  )
}


const styles = StyleSheet.create({
  containerBox: {
    flex: 1,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc'
  },
  imageContainer: {
    width: 50,
    height: 50,
    borderRadius: 50,
    overflow: 'hidden',
    marginRight: 10
  },
  image: {
    width: '100%',
    height: '100%'
  },
  infoContainer: {
    flex: 1,
    justifyContent: 'center'
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold'
  },
  lastMessage: {
    fontSize: 14,
    color: '#666'
  },
  timeContainer: {
    width: 50,
    alignItems: 'flex-end'
  },
  time: {
    fontSize: 12,
    color: '#666'
  },
  sendingText: {
    color: 'lightgrey',
    fontSize: 12,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
  },
  textInput: {
    height: 40,
    flex: 1,
    borderColor: 'transparent',
    backgroundColor: '#ececec',
    padding: 10,
    color: 'grey',
    borderRadius: 30,
    marginBottom: 20,
  },
  sendButton: {
    backgroundColor: '#fff',
    borderRadius: 50,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  listContainer: {
    width: '100%',
    height: '100%',
  },
});


export default ChatList

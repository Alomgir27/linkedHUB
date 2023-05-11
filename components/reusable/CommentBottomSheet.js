import React, { useState, useRef, useEffect, useCallback } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, Keyboard, Dimensions, KeyboardAvoidingView, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetHandle,
} from '@gorhom/bottom-sheet';

import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { baseURL } from '../config/baseURL';
import axios from 'axios';
import moment from 'moment';


const CommentBottomSheet = (props) => {

  const { title, bottomSheetModalRef, handleSheetChanges, navigation, postId } = props;

  const [post, setPost] = useState({});
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        await axios.get(`${baseURL}/api/posts/${postId}`)
          .then(res => {
            const post = res?.data?.post;
            setPost(post);
            setLoading(false);
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          })
      } catch (error) {
        console.log(error);
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    if(!post?.comments) return;
    if (post?.comments?.length > 0) {
      (async () => {
        try {
          setLoading(true);
          await axios.post(`${baseURL}/api/comments/getComments`, { comments: post?.comments, page })
            .then(res => {
              const newComments = [...comments, ...res.data.comments];
              setComments(newComments);
              setLoading(false);
            })
            .catch(err => {
              console.log(err);
              setLoading(false);
            })
        } catch (error) {
          console.log(error);
          setLoading(false);
        }
      })();
    }
  }, [page]);

  const fetchComments = () => {
    if(!hasMore) return;
    if (hasMore && post.comments.length > comments.length) {
      setPage(page + 1);
    }
    else {
      setHasMore(false);
    }
  }




  // State for new comment
  const [comment, setComment] = useState('');


  const snapPoints = React.useMemo(() => ['25%', '50%', '75%', '100%'], []);



  // Refs for BottomSheet component and FlatList
  const flatListRef = useRef(null);

  // Function to handle submitting a comment
  const handleCommentSubmit = () => {
    setLoading(true);
    // TODO: Submit comment to server
    const options = {
      uuid: post?.uuid,
      name: post?.name,
      userName: post?.userName,
      profilePic: post?.profilePic,
      comment: comment,
      postId: post?._id,
    }
    axios.post(`${baseURL}/api/comments/addComment`, options)
      .then(async (res) => {
        console.log(res);
        setComments([...comments, res.data.comment]);

        await axios.post(`${baseURL}/api/posts/addComment`, { postId: post?._id, commentId: res.data.comment?._id })
          .then(res => {
            console.log(res);
            setPost(res.data.post);
            setLoading(false);
            // Clear input field
            setComment('');
            // Scroll to bottom of comment list
            flatListRef?.current.scrollToEnd();
          })
          .catch(err => {
            console.log(err);
            setLoading(false);
          })
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      })
  };

  // Function to render the header of the bottom sheet
  const renderHeader = () => {
    return (
      <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 10 }}>
        <Text style={{ fontWeight: 'bold', fontSize: 16 }}>{title}</Text>
        <TouchableOpacity onPress={() => bottomSheetModalRef.current?.close()}>
          <MaterialCommunityIcons name="close" size={24} color="black" />
        </TouchableOpacity>
      </View>
    );
  };

  const RenderHandleCommentAndLike = ({ item }) => {
    const [isLiked, setIsLiked] = useState(false);
    const [isReplied, setIsReplied] = useState(false);

    const handleLike = () => {
      if (isLiked) {
        setIsLiked(false);
        axios.post(`${baseURL}/api/comments/unlikeComment`, { commentId: item?._id })
          .then(res => {
            console.log(res);
            setComments(res.data.comments);
          })
          .catch(err => {
            console.log(err);
          })
      }
      else {
        setIsLiked(true);
        axios.post(`${baseURL}/api/comments/likeComment`, { commentId: item?._id })
          .then(res => {
            console.log(res);
            setComments(res.data.comments);
          })
          .catch(err => {
            console.log(err);
          })
      }
    }

    const handleReply = () => {
      if (isReplied) {
        setIsReplied(false);
      }
      else {
        setIsReplied(true);
        setComment(`@${item?.name} `);
      }
    }

    return (
       <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TouchableOpacity
            onPress={handleReply}
            style={{ flexDirection: 'row', alignItems: 'center', marginRight: 10 }}
          >
            <MaterialCommunityIcons name={isReplied ? "reply-all" : "reply"} size={20} color={isReplied ? "blue" : "gray"} />
            <Text style={{ color: 'gray', fontSize: 12, marginLeft: 5 }}>{item?.subComments?.length}</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleLike}
            style={{ flexDirection: 'row', alignItems: 'center' }}
          >
            <MaterialCommunityIcons name={isLiked ? "heart" : "heart-outline"} size={20} color={isLiked ? "red" : "gray"} />
            <Text style={{ color: 'gray', fontSize: 12, marginLeft: 5 }}>{item?.likes?.length}</Text>
          </TouchableOpacity>
        </View> 
    );
  };


  const renderItem = useCallback(({ item }) => {
   
    return (
      <View style={{ flex : 1, flexDirection: 'row', alignItems: 'center', marginTop: 10, paddingHorizontal: 10 , paddingVertical : 5}}>
        <Image
          source={{ uri: item?.profilePic }}
          style={{ width: 40, height: 40, borderRadius: 20, marginRight: 10 }}
        />
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontWeight: 'bold', marginRight: 5 }}>{item?.name}</Text>
            <Text style={{ color: 'gray' }}>{`${item?.userName ? '@' + item?.userName : ''} · ${moment(item?.createdAt).format('MMM Do')}`}</Text>
          </View>
          <Text style={{ marginTop: 5 }}>{item?.comment}</Text>
          <Text style={{ color: 'gray', fontSize: 12, marginTop: 5 }}>{moment(item?.createdAt).fromNow()}</Text>
        </View>
        <View style={{ flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end' }}>
          <RenderHandleCommentAndLike item={item} />
        </View>
        
      </View>
    );
  }, [comments]);




  // Function to render the content of the bottom sheet
  const renderContent = () => {
    return (
      <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      style={{ flex: 1, marginHorizontal: 10 }}
    >
      <View style={{ flex: 1 }}>
      
        <FlatList
          
          ref={flatListRef}
          data={comments}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          onEndReached={fetchComments}
          onEndReachedThreshold={0.5}
          ListFooterComponent={() => {
            if (loading) {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  <Text style={{ color: 'gray', fontSize: 12 }}>Loading...</Text>
                </View>
              )
            }
            else {
              return (
                <View style={{ justifyContent: 'center', alignItems: 'center', marginTop: 10 }}>
                  <Text style={{ color: 'gray', fontSize: 12 }}>No more comments</Text>
                </View>
              )
            }
          }}
          ListHeaderComponent={renderHeader}

        />
        <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 16, marginBottom: 16 }}>
          <TextInput
            placeholder="Add a comment..."
            value={comment}
            onChangeText={setComment}
            style={{ flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 8, padding: 8, marginRight: 8, marginBottom: 16 }}
          />
          <TouchableOpacity onPress={handleCommentSubmit}>
            <Text style={{ color: '#318bfb', fontWeight: 'bold', justifyContent: 'center', alignSelf: 'center', marginBottom: 12 }}>Post</Text>
          </TouchableOpacity>
        </View>
      </View>
      </KeyboardAvoidingView>
    );
  };


   return (
        <BottomSheetModal
            ref={bottomSheetModalRef}
            snapPoints={snapPoints}
            index={3}           
            backdropComponent={BottomSheetBackdrop}
            handleComponent={BottomSheetHandle}
            onChange={handleSheetChanges}
          >
            {renderContent()}
          </BottomSheetModal>
      );
  };

  const styles = StyleSheet.create({
    storyImage: {
      width: 50,
      height: 50,
      borderRadius: 25,
      borderWidth: 2,
      borderColor: 'red',
    },
  });


  export default CommentBottomSheet;
        


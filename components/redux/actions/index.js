import axios from 'axios';
import { baseURL } from '../../config/baseURL';
import {
    USER_STATE_CHANGE,
    USER_POSTS_STATE_CHANGE,
    USER_POSTS_DATA_STATE_CHANGE,
    USER_FOLLOWING_STATE_CHANGE,
    USER_FOLLOWING_DATA_STATE_CHANGE,
    USERS_STATE_CHANGE,
    USERS_DATA_STATE_CHANGE,
    USERS_POSTS_STATE_CHANGE,
    USERS_POSTS_DATA_STATE_CHANGE,
    USERS_STORY_STATE_CHANGE,
    USERS_STORY_DATA_STATE_CHANGE,
    USERS_CHAT_LIST_STATE_CHANGE,
    USERS_CHAT_LIST_DATA_STATE_CHANGE,
    NOTIFICATIONS_STATE_CHANGE,
    NOTIFICATIONS_DATA_STATE_CHANGE,
    USER_SHORTVIDEOS_STATE_CHANGE,
    USER_SHORTVIDEOS_DATA_STATE_CHANGE,
    USER_SAVEDPOSTS_STATE_CHANGE,
    USER_SAVEDPOSTS_DATA_STATE_CHANGE,
    USER_FOLLOWERS_STATE_CHANGE,
    USER_FOLLOWERS_DATA_STATE_CHANGE,
    USER_FRIENDS_STATE_CHANGE,
    USER_FRIENDS_DATA_STATE_CHANGE,
    USERS_STORY_BY_UUID_STATE_CHANGE,
    CLEAR_DATA
} from '../constant/index'


export function clearData() {
    return ((dispatch) => dispatch({ type: CLEAR_DATA }))
}

export function modifyStoryState(oldStories, newStories, user) {
    return ((dispatch) => {
        newStories.push(...oldStories);
        //make stories remove duplicates
        newStories = newStories.filter((item, index) => {
            return newStories.findIndex((item2) => item2._id === item._id) === index;
        });

        //sepate stories by same uuid
        let storiesByUUID = {};
        newStories.forEach((item) => {
        if(!storiesByUUID[item.uuid]) {
            storiesByUUID[item.uuid] = [];
        }
        storiesByUUID[item.uuid].push(item);
        });
    
        //sort stories by date
        for(let key in storiesByUUID) {
        storiesByUUID[key].sort((a, b) => {
            return new Date(b.createdAt) - new Date(a.createdAt);
        });
        }
        //keep seen stories at the end if any unSeen stories are present in the array of stories of a user then keep the unSeen stories at the top
        for(let key in storiesByUUID) {
        let seenStories = [];
        let unSeenStories = [];
        storiesByUUID[key].forEach((item) => {
            if(item.seenBy?.includes(user.uuid)) {
            seenStories.push(item);
            } else {
            unSeenStories.push(item);
            }
        });
        storiesByUUID[key] = [...unSeenStories, ...seenStories];
        storiesByUUID[key].seen = unSeenStories.length === 0;
        }
        //sort stories by seen and keep seen stories at the end
        let storiesByUUIDArray = [];
        for(let key in storiesByUUID) {
        storiesByUUIDArray.push(storiesByUUID[key]);
        }
        storiesByUUIDArray.sort((a, b) => {
        if(a.seen && !b.seen) {
            return 1;
        } else if(!a.seen && b.seen) {
            return -1;
        } else {
            return 0;
        }
        });
        storiesByUUID = {};
        storiesByUUIDArray.forEach((item) => {
        storiesByUUID[item[0].uuid] = item;
        });
        //set stories
        let stories = [];
        for(let key in storiesByUUID) {
        stories.push(storiesByUUID[key][0]);
        }
        dispatch({ type: USERS_STORY_STATE_CHANGE, usersStory: stories })
        dispatch({ type: USERS_STORY_BY_UUID_STATE_CHANGE, usersStoryByUUID: storiesByUUID })
    })
}

export function getUserByUUID(uuid, location, callback) {
    return (async (dispatch) => {
       await axios.post(`${baseURL}/api/users/getUserByUUID`, { uuid, location })
            .then(async (res) => {
                if (res.data.success) {
                    console.log(res.data.user)
                    dispatch({ type: USER_STATE_CHANGE, currentUser: res.data.user })
                    let uuids = res.data.user.following.concat(res.data.user.uuid)
                    uuids = uuids.concat(res.data.user.friends)
                    dispatch(fetchUsers(uuids, location))
                    dispatch(fetchUsersStory(res?.data?.user))
                    callback(false)
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserPosts(uuid) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/posts/getUserPosts`, { uuid })
            .then(async (res) => {
                if (res.data.success) {
                    
                    dispatch({ type: USER_POSTS_STATE_CHANGE, posts: res.data.posts })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserPostsMore(uuid, lastPost) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/posts/getUserPostsMore`, { uuid, lastPost })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_POSTS_DATA_STATE_CHANGE, posts: res.data.posts })
                }
            })
            .catch((err) => console.log(err))
    })
}


export function fetchUsers(uuids, location) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUsers`, { uuids, location })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USERS_STATE_CHANGE, users: res.data.users })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUsersMore(uuids, location, lastUser) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUsersMore`, { uuids, location, lastUser })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USERS_DATA_STATE_CHANGE, users: res.data.users })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUsersStory(user) {
    let uuids = user?.following.concat(user?.uuid)
    uuids = uuids.concat(user?.friends)
    return (async (dispatch) => {
            await axios.post(`${baseURL}/api/stories/getStories`, { uuids }).then((res) => {
              if(res?.data?.success) {
                let stories = res.data.stories;
                if(stories.length > 0) {
                    stories[stories.length - 1].lastStory = true;
                }
                dispatch(modifyStoryState([], stories, user))
              }
            });
    })
}

export function fetchUsersStoryMore(user, lastStory, oldStories) {
    let uuids = user?.following.concat(user?.uuid)
    uuids = uuids.concat(user?.friends)
    return (async (dispatch) => {
            await axios.post(`${baseURL}/api/stories/getStoriesMore`, { uuids, lastStory }).then((res) => {
              if(res?.data?.success) {
                let stories = res.data.stories;
                if(stories.length > 0) {
                    stories[stories.length - 1].lastStory = true;
                }
                dispatch(modifyStoryState(oldStories, stories, user))
                console.log(oldStories, 'oldStories')
              }
            });
    })
}

export function fetchUsersChatList(uuids) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUsersChatList`, { uuids })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USERS_CHAT_LIST_STATE_CHANGE, users: res.data.users })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUsersChatListMore(uuids, lastUser) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUsersChatListMore`, { uuids, lastUser })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USERS_CHAT_LIST_DATA_STATE_CHANGE, users: res.data.users })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchNotifications(uuid) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/notifications/getNotifications`, { uuid })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: NOTIFICATIONS_STATE_CHANGE, notifications: res.data.notifications })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchNotificationsMore(uuid, lastNotification) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/notifications/getNotificationsMore`, { uuid, lastNotification })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: NOTIFICATIONS_DATA_STATE_CHANGE, notifications: res.data.notifications })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserFriends(uuids) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUserFriends`, { uuids })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_FRIENDS_STATE_CHANGE, friends: res.data.friends })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserFriendsMore(uuids, lastUser) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUserFriendsMore`, { uuids, lastUser })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_FRIENDS_DATA_STATE_CHANGE, friends: res.data.friends })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserFollowers(uuids) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUserFollowers`, { uuids })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_FOLLOWERS_STATE_CHANGE, followers: res.data.followers })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserFollowersMore(uuids, lastUser) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUserFollowersMore`, { uuids, lastUser })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_FOLLOWERS_DATA_STATE_CHANGE, followers: res.data.followers })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserFollowing(uuids) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUserFollowing`, { uuids })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_FOLLOWING_STATE_CHANGE, following: res.data.following })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserFollowingMore(uuids, lastUser) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/users/getUserFollowingMore`, { uuids, lastUser })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_FOLLOWING_DATA_STATE_CHANGE, following: res.data.following })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUsersPosts(uuids) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/posts/getUserPosts`, { uuids })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USERS_POSTS_STATE_CHANGE, userPosts : res.data.userPosts })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUsersPostsMore(uuids, lastPost) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/posts/getUserPostsMore`, { uuids, lastPost })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USERS_POSTS_DATA_STATE_CHANGE, userPosts : res.data.userPosts })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserShortVideos(uuids) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/shortVideos/getUserShortVideos`, { uuids })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_SHORTVIDEOS_STATE_CHANGE, shortVideos : res.data.shortVideos })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserShortVideosMore(uuids, lastShortVideo) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/shortVideos/getUserShortVideosMore`, { uuids, lastShortVideo })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_SHORTVIDEOS_DATA_STATE_CHANGE, shortVideos : res.data.shortVideos })
                }
            })
            .catch((err) => console.log(err))
    })
}


export function fetchUserSavedPosts(uuids) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/posts/getUserSavedPosts`, { uuids })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_SAVEDPOSTS_STATE_CHANGE, savedPosts : res.data.savedPosts })
                }
            })
            .catch((err) => console.log(err))
    })
}

export function fetchUserSavedPostsMore(uuids, lastSavedPost) {
    return (async (dispatch) => {
        await axios.post(`${baseURL}/api/posts/getUserSavedPostsMore`, { uuids, lastSavedPost })
            .then((res) => {
                if (res.data.success) {
                    dispatch({ type: USER_SAVEDPOSTS_DATA_STATE_CHANGE, savedPosts : res.data.savedPosts })
                }
            })
            .catch((err) => console.log(err))
    })
}







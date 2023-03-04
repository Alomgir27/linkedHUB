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
    USERS_STORY_BY_UUID_DATA_STATE_CHANGE,
    CLEAR_DATA
} from '../constant/index'

const initialState = {
    currentUser: null,
    following: [],
    users: [],
    usersStory: [],
    usersStoryByUUID: {},
    usersChatList: [],
    notifications: [],
    shortVideos: [],
    savedPosts: [],
    followers: [],
    friends: [],
    posts: [],
    usersPosts: []
}

export default function data(state = initialState, action) {
    switch (action.type) {
        case USER_STATE_CHANGE:
            return {
                ...state,
                currentUser: action.currentUser
            }
        case USER_POSTS_STATE_CHANGE:
            return {
                ...state,
                posts: action.posts
            }
        case USER_POSTS_DATA_STATE_CHANGE:
            return {
                ...state,
                posts: [...state.posts, ...action.posts]
            }
        case USER_FOLLOWING_STATE_CHANGE:
            return {
                ...state,
                following: action.following
            }
        case USER_FOLLOWING_DATA_STATE_CHANGE:
            return {
                ...state,
                following: [...state.following, ...action.following]
            }
        case USERS_STATE_CHANGE:
            return {
                ...state,
                users: action.users
            }
        case USERS_DATA_STATE_CHANGE:
            return {
                ...state,
                users: [...state.users, ...action.users]
            }
        case USERS_POSTS_STATE_CHANGE:
            return {
                ...state,
                usersPosts: action.usersPosts
            }
        case USERS_POSTS_DATA_STATE_CHANGE:
            return {
                ...state,
                usersPosts: [...state.usersPosts, ...action.usersPosts]
            }
        case USERS_STORY_STATE_CHANGE:
            return {
                ...state,
                usersStory: action.usersStory
            }
        case USERS_STORY_DATA_STATE_CHANGE:
            return {
                ...state,
                usersStory: [...state.usersStory, ...action.usersStory]
            }
        case USERS_STORY_BY_UUID_STATE_CHANGE:
            return {
                ...state,
                usersStoryByUUID: action.usersStoryByUUID
            }
        case USERS_STORY_BY_UUID_DATA_STATE_CHANGE:
            return {
                ...state,
                //remove the old story if action.uuid is already in the state and add the new one
                usersStoryByUUID: {
                    ...state.usersStoryByUUID,
                    [action.uuid]: action.usersStoryByUUID
                }
                
            }
        case USERS_CHAT_LIST_STATE_CHANGE:
            return {
                ...state,
                usersChatList: action.usersChatList
            }
        case USERS_CHAT_LIST_DATA_STATE_CHANGE:
            return {
                ...state,
                usersChatList: [...state.usersChatList, ...action.usersChatList]
            }
        case NOTIFICATIONS_STATE_CHANGE:
            return {
                ...state,
                notifications: action.notifications
            }
        case NOTIFICATIONS_DATA_STATE_CHANGE:
            return {
                ...state,
                notifications: [...state.notifications, ...action.notifications]
            }
        case USER_SHORTVIDEOS_STATE_CHANGE:
            return {
                ...state,
                shortVideos: action.shortVideos
            }
        case USER_SHORTVIDEOS_DATA_STATE_CHANGE:
            return {
                ...state,
                shortVideos: [...state.shortVideos, ...action.shortVideos]
            }
        case USER_SAVEDPOSTS_STATE_CHANGE:
            return {
                ...state,
                savedPosts: action.savedPosts
            }
        case USER_SAVEDPOSTS_DATA_STATE_CHANGE:
            return {
                ...state,
                savedPosts: [...state.savedPosts, ...action.savedPosts]
            }
        case USER_FOLLOWERS_STATE_CHANGE:
            return {
                ...state,
                followers: action.followers
            }
        case USER_FOLLOWERS_DATA_STATE_CHANGE:
            return {
                ...state,
                followers: [...state.followers, ...action.followers]
            }
        case USER_FRIENDS_STATE_CHANGE:
            return {
                ...state,
                friends: action.friends
            }
        case USER_FRIENDS_DATA_STATE_CHANGE:
            return {
                ...state,
                friends: [...state.friends, ...action.friends]
            }
        case CLEAR_DATA:
            return initialState
        default:
            return state
    }
}


        
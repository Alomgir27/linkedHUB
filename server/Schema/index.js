const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name: String,
    email: String,
    password: {
        type: String,
        validate: {
            validator: function(v) {
                return v.length >= 6;
            }
        },
        required: [true, 'Password is required'],
        minLenght: 6
    },
    userName: String,
    profilePic: String,
    uuid: String,
    bio: String,
    followers: [String],
    following: [String],
    friends: {
        type: [String],
        default: [],
        validate: {
            validator: function(v) {
                return v.length <= 5000;
            },
            message: 'Friends list reached maximum size of 5000'
        },
        maxLenght: 5000

    },
    location: {
        type: { type: String, default: 'Point' },
        coordinates: { type: [Number], default: [0, 0], index: '2dsphere' },
    },
    posts: [String],
    savedPosts: [String],
    notifications: [String],
    chats: [String],
    createdAt: { type: Date, default: Date.now},
    updatedAt: String,
    lastSeen: String,
    isOnline: Boolean,
    isPrivate: Boolean,
    isVerified: Boolean,
    isCreator: Boolean,
    isVerified: Boolean,
}, { timestamps: true });

const postSchema = new Schema({
    uuid: String,
    name: String,
    userName: String,
    profilePic: String,
    caption: String,
    type: String,
    image: String,
    video: String,
    file: String,
    likes: [String],
    comments: [String],
    createdAt: { type: Date, default: Date.now},
    updatedAt: String,
});

const commentSchema = new Schema({
    uuid: String,
    name: String,
    userName: String,
    profilePic: String,
    type: String,
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    comment: String,
    createdAt: { type: Date, default: Date.now},
    updatedAt: String,
});



const savedPostSchema = new Schema({
    uuid: String,
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    createdAt: { type: Date, default: Date.now},
    updatedAt: String,
});


const likeSchema = new Schema({
    uuid: String,
    name: String,
    userName: String,
    profilePic: String,
    post: { type: Schema.Types.ObjectId, ref: 'Post' },
    createdAt: { type: Date, default: Date.now},
    updatedAt: String,
});

const storySchema = new Schema({
    uuid: String,
    name: String,
    userName: String,
    profilePic: String,
    image: String,
    seenBy: [String],
    likedBy: [String],
    createdAt: { type: Date, default: Date.now},
    updatedAt: String,
});

const shortVideos = new Schema({
    uuid: String,
    name: String,
    userName: String,
    profilePic: String,
    video: String,
    createdAt: { type: Date, default: Date.now},
    updatedAt: String,
});




const User = mongoose.model("User", userSchema);
const Post = mongoose.model("Post", postSchema);
const Comment = mongoose.model("Comment", commentSchema);
const SavedPost = mongoose.model("SavedPost", savedPostSchema);
const Like = mongoose.model("Like", likeSchema);
const Story = mongoose.model("Story", storySchema);
const ShortVideo = mongoose.model("ShortVideo", shortVideos);

User.createIndexes([{"location": "2dsphere"}]);

module.exports = {
    User,
    Post,
    Comment,
    SavedPost,
    Like,
    Story,
    ShortVideo
}

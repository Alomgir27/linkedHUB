import mongoose from "mongoose";
const Schema = mongoose.Schema;

export const userSchema = new Schema({
    name: String,
    email: String,
    password: String,
    profilePicture: String,
    bio: String,
    followers: [String],
    following: [String],
    posts: [String],
    savedPosts: [String],
    notifications: [String],
    chats: [String],
    createdAt: String,
    updatedAt: String,
    lastSeen: String,
    isOnline: Boolean,
    isPrivate: Boolean,
    isVerified: Boolean,
    isBusiness: Boolean,
    isCreator: Boolean,
    isVerified: Boolean,
});

export const postSchema = new Schema({
    user: String,
    caption: String,
    image: String,
    likes: [String],
    comments: [String],
    createdAt: String,
    updatedAt: String,
});

export const commentSchema = new Schema({
    user: String,
    post: String,
    comment: String,
    createdAt: String,
    updatedAt: String,
});

export const chatSchema = new Schema({
    user: String,
    messages: [String],
    createdAt: String,
    updatedAt: String,
});

export const messageSchema = new Schema({
    user: String,
    chat: String,
    message: String,
    createdAt: String,
    updatedAt: String,
});

export const notificationSchema = new Schema({
    user: String,
    message: String,
    createdAt: String,
    updatedAt: String,
});

export const savedPostSchema = new Schema({
    user: String,
    post: String,
    createdAt: String,
    updatedAt: String,
});

export const followerSchema = new Schema({
    user: String,
    follower: String,
    createdAt: String,
    updatedAt: String,
});

export const followingSchema = new Schema({
    user: String,
    following: String,
    createdAt: String,
    updatedAt: String,
});

export const likeSchema = new Schema({
    user: String,
    post: String,
    createdAt: String,
    updatedAt: String,
});

export const storySchema = new Schema({
    user: String,
    image: String,
    createdAt: String,
    updatedAt: String,
});

export const businessSchema = new Schema({
    user: String,
    name: String,
    email: String,
    password: String,
    profilePicture: String,
    bio: String,
    followers: [String],
    following: [String],
    posts: [String],
    savedPosts: [String],
    notifications: [String],
    chats: [String],
    createdAt: String,
    updatedAt: String,
    lastSeen: String,
    isOnline: Boolean,
    isPrivate: Boolean,
    isVerified: Boolean,
    isBusiness: Boolean,
    isCreator: Boolean,
    isVerified: Boolean,
});

export const creatorSchema = new Schema({
    user: String,
    name: String,
    email: String,
    password: String,
    profilePicture: String,
    bio: String,
    followers: [String],
    following: [String],
    posts: [String],
    savedPosts: [String],
    notifications: [String],
    chats: [String],
    createdAt: String,
    updatedAt: String,
    lastSeen: String,
    isOnline: Boolean,
    isPrivate: Boolean,
    isVerified: Boolean,
    isBusiness: Boolean,
    isCreator: Boolean,
    isVerified: Boolean,
});

export const verificationSchema = new Schema({
    user: String,
    name: String,
    email: String,
    password: String,
    profilePicture: String,
    bio: String,
    followers: [String],
    following: [String],
    posts: [String],
    savedPosts: [String],
    notifications: [String],
    chats: [String],
    createdAt: String,
    updatedAt: String,
    lastSeen: String,
    isOnline: Boolean,
    isPrivate: Boolean,
    isVerified: Boolean,
    isBusiness: Boolean,
    isCreator: Boolean,
    isVerified: Boolean,
});

export const verificationRequestSchema = new Schema({
    user: String,
    name: String,
    email: String,
    password: String,
    profilePicture: String,
    bio: String,
    followers: [String],
    following: [String],
    posts: [String],
    savedPosts: [String],
    notifications: [String],
    chats: [String],
    createdAt: String,
    updatedAt: String,
    lastSeen: String,
    isOnline: Boolean,
    isPrivate: Boolean,
    isVerified: Boolean,
    isBusiness: Boolean,
    isCreator: Boolean,
    isVerified: Boolean,
});


export const User = mongoose.model("User", userSchema);
export const Post = mongoose.model("Post", postSchema);
export const Comment = mongoose.model("Comment", commentSchema);
export const Chat = mongoose.model("Chat", chatSchema);
export const Message = mongoose.model("Message", messageSchema);
export const Notification = mongoose.model("Notification", notificationSchema);
export const SavedPost = mongoose.model("SavedPost", savedPostSchema);
export const Follower = mongoose.model("Follower", followerSchema);
export const Following = mongoose.model("Following", followingSchema);
export const Like = mongoose.model("Like", likeSchema);
export const Story = mongoose.model("Story", storySchema);
export const Business = mongoose.model("Business", businessSchema);
export const Creator = mongoose.model("Creator", creatorSchema);
export const Verification = mongoose.model("Verification", verificationSchema);
export const VerificationRequest = mongoose.model("VerificationRequest", verificationRequestSchema);

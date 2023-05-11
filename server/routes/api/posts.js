const express = require('express');
const router = express.Router();


// Load Post from schema
const Post = require('../../Schema/index').Post;
const User = require('../../Schema/index').User;

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public
router.get('/test', (req, res) => res.json({ msg: 'Posts Works' }));

// @route   GET api/posts
// @desc    Get posts
// @access  Public
router.get('/', (req, res) => {
    Post.find()
        .sort({ date: -1 })
        .then(posts => res.status(200).json({ posts, success: true }))
        .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.status(200).json({ post, success: true }))
        .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});


// @route   POST api/posts  
// @desc    Create post
// @access  Private

router.post('/', (req, res) => {

    if (!req.body.uuid) {
        return res.status(400).json({ uuid: 'uuid is required' });
    }
    
    console.log(req.body);
    let downloadURLs = [];
    if(req.body.downloadURLs) {
        downloadURLs = req.body.downloadURLs;
        let images = []
        let videos = []
        downloadURLs.map((downloadURL) => {
            if(downloadURL.type === 'image') {
                images.push(downloadURL);
            }
            else {
                videos.push(downloadURL);
            }
        });
        downloadURLs = [...videos, ...images];
    }

    const newPost = new Post({
        uuid: req.body.uuid,
        name: req.body.name,
        userName: req.body.userName,
        profilePic: req.body.profilePic,
        caption: req.body.caption,
        downloadURLs: downloadURLs,
        location: {
            type: req.body.location.type || 'Point',
            coordinates: req.body.location.coordinates,
        },
        likes: req.body.likes,
        comments: req.body.comments,
        createdAt: req.body.createdAt,
        updatedAt: req.body.updatedAt,
    });

    newPost.save().then(post => 
        res.status(200).json({ post, success: true })
    )
    .catch(err => {
        console.log(err);
        res.status(400).json({ msg: 'Error saving post', success: false });
    });

});


// @route   POST api/posts/getPosts
// @desc    Get posts by uuids
// @access  Private

router.post('/getPosts', (req, res) => {
     const { uuids } = req.body;
     if(!uuids) {
            return res.status(400).json({ uuids: 'uuids are required' });
        }
    Post.find({ uuid: { $in: uuids } })
        .sort({ createdAt: -1 })
        .limit(100)
        .then(posts => res.json({ posts, success: true }))
        .catch(err => res.status(404).json({ nopostsfound: 'No posts found', success: false }));
});


// @route   POST api/posts/getPostsMore
// @desc    Get posts by uuids
// @access  Private

router.post('/getPostsMore', (req, res) => {
    const { uuids, skip } = req.body;

    if(!uuids) {
            return res.status(400).json({ uuids: 'uuids are required' });
        }
    Post.find({ uuid: { $in: uuids } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(100)
        .then(posts => res.json({ posts, success: true }))
        .catch(err => res.status(404).json({ nopostsfound: 'No posts found', success: false }));


   
});



// @route   POST api/posts/getPostsByUser
// @desc    Get posts by uuid
// @access  Private

router.post('/getPostsByUser', (req, res) => {
    const { uuid } = req.body;
    if(!uuid) {
              return res.status(400).json({ uuid: 'uuid is required' });
            }
    Post.find({ uuid: uuid })
        .sort({ createdAt: -1 })
        .limit(100)
        .then(posts => res.json({ posts, success: true }))
        .catch(err => res.status(404).json({ nopostsfound: 'No posts found', success: false }));
});

// @route   POST api/posts/likePost
// @desc    Like post
// @access  Private

router.post('/likePost', (req, res) => {
    const { uuid, postId } = req.body;
    console.log(req.body);
    if(!uuid) {
                return res.status(400).json({ uuid: 'uuid is required' });
            }
    if(!postId) {
                return res.status(400).json({ postId: 'postId is required' });
            }
        
    Post.findById({ _id: postId})
        .then(post => {
            if(post.likes.filter(like => like === uuid).length > 0) {
                return res.status(400).json({ alreadyliked: 'User already liked this post' });
            }
            post.likes.unshift(uuid);
            console.log(post);
            post.save().then(post => res.json({ post, success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

// @route   POST api/posts/unlikePost
// @desc    Unlike post
// @access  Private

router.post('/unlikePost', (req, res) => {
    const { uuid, postId } = req.body;
    console.log(req.body);
    if(!uuid) {
                return res.status(400).json({ uuid: 'uuid is required' });
            }
    if(!postId) {
                return res.status(400).json({ postId: 'postId is required' });
            }
            
    Post.findById({ _id: postId})
        .then(post => {
            if(post.likes.filter(like => like === uuid).length === 0) {
                return res.status(400).json({ notliked: 'You have not yet liked this post' });
            }
            console.log(post);
            const removeIndex = post.likes.map(item => item).indexOf(uuid);
            post.likes.splice(removeIndex, 1);
            post.save().then(post => res.json({ post, success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});


// @route   POST api/posts/addComment
// @desc    Comment post
// @access  Private

router.post('/addComment', (req, res) => {
    const {  postId, commentId } = req.body;

    if(!postId) {
                return res.status(400).json({ postId: 'postId is required' });
            }
    if(!commentId) {
                return res.status(400).json({ commentId: 'commentId is required' });
            }

    
    Post.findById({ _id: postId})
        .then(post => {
            if(post.comments.filter(comment => comment === commentId).length > 0) {
                return res.status(400).json({ alreadycommented: 'User already commented on this post' });
            }
            post.comments.unshift(commentId);
            console.log(post);
            post.save().then(post => res.json({ post, success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});



module.exports = router;

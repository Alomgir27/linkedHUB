const express = require('express');
const router = express.Router();


// Load Post from schema
const Post = require('../../Schema/index').Post;

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
        .then(posts => res.json(posts))
        .catch(err => res.status(404).json({ nopostsfound: 'No posts found' }));
});

// @route   GET api/posts/:id
// @desc    Get post by id
// @access  Public
router.get('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => res.json(post))
        .catch(err => res.status(404).json({ nopostfound: 'No post found with that ID' }));
});

// @route   POST api/posts  
// @desc    Create post
// @access  Private

router.post('/', (req, res) => {
    const newPost = new Post({
        user: req.body.user,
        caption: req.body.caption,
        type: req.body.type,
        image: req.body.image,
        video: req.body.video,
        file: req.body.file,
        likes: req.body.likes,
        comments: req.body.comments,
        updatedAt: req.body.updatedAt,
    });

    newPost.save().then(post => res.json(post));
});

// @route   DELETE api/posts/:id
// @desc    Delete post
// @access  Private
router.delete('/:id', (req, res) => {
    Post.findById(req.params.id)
        .then(post => {
            // Delete
            post.remove().then(() => res.json({ success: true }));
        })
        .catch(err => res.status(404).json({ postnotfound: 'No post found' }));
});

module.exports = router;

const express = require('express');
const router = express.Router();
const axios = require('axios');

// Load User from schema
const User = require('../../Schema/index').User;
const Post = require('../../Schema/index').Post;
const Comment = require('../../Schema/index').Comment;


// @route   GET api/comments/test
// @desc    Tests comments route
// @access  Public

router.post('/test', (req, res) => res.json({ msg: 'Comments Works' }));

// @route   GET api/comments/createComment
// @desc    Create comment
// @access  Private


router.post('/addComment', (req, res) => {
    const { uuid, name, userName, profilePic, comment, postId } = req.body;

    if(!uuid || !name  || !profilePic || !comment || !postId) {
        return res.status(400).json({ msg: 'All fields are required' });
    }

    const newComment = new Comment({
        uuid,
        name,
        userName,
        profilePic,
        comment,
        postId,
        subComments: [],
        likes: [],
    });

    newComment.save()
        .then(comment => {
            res.status(200).json({ comment, success: true });
        })
        .catch(err => {
            console.log(err);
            res.status(400).json({ msg: 'Error saving comment', success: false });
        });
});




// @route   GET api/comments/getComments
// @desc    Get comments
// @access  Public
router.post('/getComments', (req, res) => {
    const { comments, page } = req.body;
    const skip = (page - 1) * 10;

    console.log(comments, page, skip);

    Comment.find({ _id: { $in: comments } })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(10)
        .then(comments => res.status(200).json({ comments, success: true }))
        .catch(err => res.status(404).json({ msg: 'No comments found' }));
});


// @route   POST api/comments
// @desc    Create comment
// @access  Private
router.get('/:id', (req, res) => {
    Comment.findById(req.params.id)
        .then(comment => res.status(200).json({ comment, success: true }))
        .catch(err => res.status(404).json({ msg: 'No comment found with that ID' }));
});



module.exports = router;
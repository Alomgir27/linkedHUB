const express = require('express');
const router = express.Router();

const axios = require('axios');

// Load User from schema
const User = require('../../Schema/index').User;
const Story = require('../../Schema/index').Story;



// @route   GET api/stories/addStory
// @desc    Add story
// @access  Public
router.post('/addStory', (req, res) => {
    const { uuid, imageURL, name, userName, profilePic } = req.body;
    console.log(req.body);

    if (!uuid) {
        return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }

    User.findOne({ uuid })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exists', success: false });

            const newStory = new Story({
                uuid: uuid,
                image: imageURL,
                name: name,
                userName: userName,
                profilePic: profilePic,
                likedBy: []
            });

            newStory.save()
                .then(story => {
                    res.status(200).json({ story, success: true });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({ msg: 'Error saving story', success: false });
                });
        });
});


// @route   GET api/stories/getStories
// @desc    Get 20 stories from database if uuids is  matched  and from last 24 hours
// @access  Public

router.post('/getStories', async (req, res) => {
    const { uuids } = req.body;
    console.log(req.body);

    if (!uuids) {
        return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }

   Story.find({ uuid: { $in: uuids }, createdAt: { $gte: new Date(new Date().getTime() - 24 * 60 * 60 * 1000) } }).limit(20)
        .then(stories => {
            if (!stories) {
                return res.status(400).json({ msg: 'Stories does not exist', success: false });
            }
            console.log(stories, 'stories')
            return res.status(200).json({ stories, success: true });
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error', success: false });
        });
});


// @route   GET api/stories/getStoriesMore
// @desc    Get 10 stories from database if uuids is  matched after lastStory
// @access  Public

router.post('/getStoriesMore', (req, res) => {
    const { uuids, lastStory } = req.body;
    console.log(req.body);

    if (!uuids) {
        return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }

    Story.find({ uuid: { $in: uuids }, _id: { $gt: lastStory } })
        .then(stories => {
            if (!stories) {
                return res.status(400).json({ msg: 'Stories does not exist', success: false });
            }
            console.log(stories, 'stories')
            return res.status(200).json({ stories, success: true });
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error', success: false });
        });
});


// @route   update api/stories/viewed
// @desc    update story viewed given story id and uuid
// @access  Public

router.post('/viewed', (req, res) => {
    const { uuid, storyId } = req.body;
    console.log(req.body);

    if (!uuid || !storyId) {
        return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }

    Story.findOne({ _id: storyId })
        .then(story => {
            if (!story) {
                return res.status(400).json({ msg: 'Story does not exist', success: false });
            }
            if (story.seenBy.includes(uuid)) {
                return res.status(200).json({ msg: 'Story already viewed', success: false });
            }
            story.seenBy.push(uuid);
            story.save()
                .then(story => {
                    return res.status(200).json({ story, success: true });
                }).catch(err => {
                    console.error(err);
                    return res.status(500).json({ msg: 'Internal server error', success: false });
                });
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error', success: false });
        });
});



// @route   update api/stories/liked
// @desc    update story liked given story id and uuid
// @access  Public

router.post('/liked', (req, res) => {
    const { uuid, storyId } = req.body;
    console.log(req.body);

    if (!uuid || !storyId) {
        return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }

    Story.findOne({ _id: storyId })
        .then(story => {
            if (!story) {
                return res.status(400).json({ msg: 'Story does not exist', success: false });
            }
            if (story.likedBy.includes(uuid)) {
                return res.status(200).json({ msg: 'Story already liked', success: false });
            }
            story.likedBy.push(uuid);
            story.save()
                .then(story => {
                    return res.status(200).json({ story, success: true });
                }).catch(err => {
                    console.error(err);
                    return res.status(500).json({ msg: 'Internal server error', success: false });
                });
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error', success: false });
        });
});


// @route   update api/stories/unliked
// @desc    update story unliked given story id and uuid
// @access  Public

router.post('/unliked', (req, res) => {
    const { uuid, storyId } = req.body;
    console.log(req.body);

    if (!uuid || !storyId) {
        return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }

    Story.findOne({ _id: storyId })
        .then(story => {
            if (!story) {
                return res.status(400).json({ msg: 'Story does not exist', success: false });
            }
            if (!story.likedBy.includes(uuid)) {
                return res.status(200).json({ msg: 'Story already unliked', success: false });
            }
            story.likedBy = story.likedBy.filter(id => id !== uuid);
            story.save()
                .then(story => {
                    return res.status(200).json({ story, success: true });
                }).catch(err => {
                    console.error(err);
                    return res.status(500).json({ msg: 'Internal server error', success: false });
                });
        }).catch(err => {
            console.error(err);
            return res.status(500).json({ msg: 'Internal server error', success: false });
        });
});







module.exports = router;
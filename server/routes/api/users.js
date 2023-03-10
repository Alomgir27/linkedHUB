const express = require('express');
const router = express.Router();
const bcrypt = require("bcryptjs");
const axios = require('axios');

// Load User from schema
const User = require('../../Schema/index').User;
const Post = require('../../Schema/index').Post;
const Comment = require('../../Schema/index').Comment;
const SavedPost = require('../../Schema/index').SavedPost;
const Follower = require('../../Schema/index').Follower;
const Following = require('../../Schema/index').Following;
const Like = require('../../Schema/index').Like;
const Story = require('../../Schema/index').Story;


// @route   GET api/users/test
// @desc    Tests users route
// @access  Public

router.post('/test', (req, res) => res.json({ msg: 'Users Works' }));

// @route   GET api/users/register
// @desc    Register user
// @access  Public
router.post('/register', (req, res) => {
    const { name, email, password , profilePic, uuid} = req.body;



    if (!name || !email || !password) {
        return res.status(400).json({ msg: 'Please enter all fields' });
    }

    User.findOne({ email })
        .then(user => {
            if (user) return res.status(400).json({ msg: 'User already exists' });

            const newUser = new User({
                name,
                email,
                password,
                profilePic,
                uuid
            });

            // Create salt & hash
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err) throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => {
                            res.status(200).json({ user , success: true });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).json({ msg: 'Error saving user', success: false });
                        });
                });
            });
        });
});

                    
// @route   GET api/users/login
// @desc    Login user
// @access  Public
router.post('/getUserByUUID', (req, res) => {
    const { uuid, location } = req.body;
    

    if (!uuid) {
        return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }

    User.findOne({ uuid })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exists', success: false });

            let locationObj = { type: "Point", coordinates: [location?.longitude || 0, location?.latitude || 0] };

            user.location = locationObj;
            user.save()
                .then(user => {
                    res.status(200).json({ user , success: true });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({ msg: 'Error saving user', success: false });
                });
        });
});

// @route   GET api/users/getUsersByUUIDs
// @desc    Get users by uuids
// @access  Public
router.post('/getUsersByUUIDs', (req, res) => {
    const { uuids } = req.body;
    console.log(req.body);

    if (!uuids) {
        return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }

    User.find({ uuid: { $in: uuids } })
        .then(users => {
            if (!users) return res.status(400).json({ msg: 'User does not exists', success: false });
            res.status(200).json({ users , success: true });
        });
});


// @route   GET api/users/getUsers
// @desc    Get 10 users from database if uuids is not matched and fetch first most nearest location users
// @access  Public

router.post('/getUsers', async (req, res) => {
    const { uuids, location } = req.body;
    console.log(req.body);
  
    if (!uuids) {
      return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }


    //get 10 users from database if uuids is not matched and fetch first most nearest location users
    let locationObj = { type: "Point", coordinates: [location?.longitude || 0, location?.latitude || 0] };
    User.aggregate([
        {
            $geoNear: {
                near: locationObj,
                distanceField: "distance",
                maxDistance: 100000,
                spherical: true
            }
        },
        {
            $match: {
                uuid: { $nin: uuids }
            }
        },
        {
            $limit: 10
        }   
    ]).then(users => {
        if (!users) {
            return res.status(400).json({ msg: 'Users does not exist', success: false });
        }
        // console.log(users, 'users')
        return res.status(200).json({ users, success: true });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error', success: false });
    });
    

});
  

    
// @route   GET api/users/getUsersMore
// @desc    Get 10 users from database if uuids is not matched and 
// @access  Public

router.post('/getUsersMore', (req, res) => {
    const { uuids, location, lastUser } = req.body;
    console.log(req.body);

    if (!uuids) {
        return res.status(400).json({ msg: 'Please enter all fields', success: false });
    }

    //get 10 users from database if uuids is not matched after lastUser and fetch first most nearest location users
    let locationObj = { type: "Point", coordinates: [location?.longitude || 0, location?.latitude || 0] };
    User.aggregate([
        {
            $geoNear: {
                near: locationObj,
                distanceField: "distance",
                maxDistance: 100000,
                spherical: true
            }
        },
        {
            $match: {
                uuid: { $nin: uuids },
                _id: { $gt: lastUser }
            }
        },
        {
            $limit: 10
        }
    ]).then(users => {
        if (!users) {
            return res.status(400).json({ msg: 'Users does not exist', success: false });
        }
        // console.log(users, 'users')
        return res.status(200).json({ users, success: true });
    }).catch(err => {
        console.error(err);
        return res.status(500).json({ msg: 'Internal server error', success: false });
    });

});


// @route    POST api/users/updateUser
// @desc     Update user
// @access   Public


router.post('/updateUser', (req, res) => {
    const { name, email, bio, profilePic, userName, uuid } = req.body;
    console.log(req.body);


    User.findOne({ uuid })
        .then(user => {
            if (!user) return res.status(400).json({ msg: 'User does not exists', success: false });

            user.name = name;
            user.email = email;
            user.bio = bio;
            user.profilePic = profilePic;
            user.userName = userName;

            user.save()
                .then(user => {
                    Story.find({ uuid })
                        .then(stories => {
                            stories.forEach(story => {
                                story.name = name;
                                story.profilePic = profilePic;
                                story.userName = userName;
                                story.save();
                            });
                        })
                        .catch(err => {
                            console.log(err);
                            res.status(400).json({ msg: 'Error saving user', success: false });
                        });
                        //Here we will update other collections like comments, likes, etc



                      res.status(200).json({ user , success: true });
                })
                .catch(err => {
                    console.log(err);
                    res.status(400).json({ msg: 'Error saving user', success: false });
                });
        });
});



    




module.exports = router;
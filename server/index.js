const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');


const users = require('./routes/api/users');
const posts = require('./routes/api/posts');
const stories = require('./routes/api/stories');

const app = express();

// Body parser middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(cors());
mongoose.set('strictQuery', false);


// DB Config
const { mongoURI } = require('./config/keys');




// Connect to MongoDB and create linkedHUB
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('MongoDB Connected'))
    .catch(err => console.log(err));



// Use Routes
app.use('/api/users', users);
app.use('/api/posts', posts);
app.use('/api/stories', stories);

//Allow access Post, Put, Delete and Patch
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,PATCH,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});



const port = process.env.PORT || 5000;


app.listen(port, () => console.log(`Server running on port ${port}`));





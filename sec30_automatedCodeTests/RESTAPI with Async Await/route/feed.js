const express = require('express')
const { body } = require('express-validator');

const feedController = require('../controller/feedController');
const isAuth = require('../middleware/is-auth');


const router = express.Router();

//in react.. request sent from src->page->feed->feed.js

//=> GET /feed/post ....all post
router.get('/post', isAuth, feedController.getPosts);

//creating post feed
router.post('/post', 
    [
        body('title')
        .trim()
        .isLength( {min: 5}),
        body('content')
        .trim()
        .isLength( {min: 5})
    ],
    isAuth,
    feedController.createPost
);

//get a post detail.
router.get('/post/:postId', isAuth, feedController.getAPost);

//edit or update post.
router.put('/post/:postId',
    [
        body('title')
        .trim()
        .isLength( {min: 5}),
        body('content')
        .trim()
        .isLength( {min: 5})
    ],
    isAuth,
    feedController.updatePost
)

/*deleting post*/
router.delete('/post/:postId', isAuth, feedController.deletePost)

module.exports = router
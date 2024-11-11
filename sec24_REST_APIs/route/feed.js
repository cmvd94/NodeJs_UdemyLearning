const express = require('express')

const feedController = require('../controller/feedController');

const router = express.Router();

//=> GET /feed/posts
router.get('/post', feedController.getPosts);

router.post('/post', feedController.createPost);

module.exports = router
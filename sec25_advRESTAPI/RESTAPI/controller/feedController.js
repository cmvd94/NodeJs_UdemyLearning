const {validationResult} = require('express-validator');


const PostModel = require('../model/post');
const UserModel = require('../model/user')
const fileHelper = require('../util/fileHelper')

///get all posts with pagination logic
exports.getPosts = (req, res, next) => {
    const currentPage = req.query.page || 1;
    const itemPerPage = 2;
    let totalItem;
    PostModel.find().countDocuments()
    .then( totalDoc => {
        totalItem = totalDoc;
        return PostModel.find()//pagination logic
          .skip((currentPage-1) * itemPerPage)
          .limit(itemPerPage)
    })
    .then( posts => {
        //console.log(allPosts);
        res.status(200).json( {
            message: 'all post fetched',
            posts: posts,//posts key defined in react.
            totalItems: totalItem 
        })
    })
    .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
      });
}

/*single post fields in react title,author,date,image,content*/
//react->sec->pages->feed->singlepost->singlepost.js
exports.createPost = (req, res, next) => {
    const error = validationResult(req);
    if(!error.isEmpty()){
        const error = new Error('creating post validaion error ');
        error.statusCode = 422;
        throw error;//throw inside then block sent to catch()
    }
    if(!req.file){
        const error = new Error('No image provided');
        error.statusCode = 422;
        throw error;
    }
    console.log(req.file);
    const imageUrl = req.file.path.replace("\\" ,"/");//for mac and linux replace no needed . so glitch in windows
    const title = req.body.title;
    const content = req.body.content;
    let creator;
    const post = new PostModel({
        title: title,
        content: content,
        imageUrl: imageUrl,
        creator: req.userId//in isauth req.userId is stored. with string mongoose will create an ObjId
        //creator: {name: 'vishnudas'}
    });
    post.save()
      .then( (result) => {//user should have list of product it created
        //console.log('---------------')
        //console.log(result)
        //console.log('---------------')
        //console.log(post)
        return UserModel.findById(req.userId)
      })
      .then( user => {
        creator = user;
        user.posts.push(post)//from this mongoose will store id in user post array
        return user.save()
      })
      .then(result => {
        res.status(201).json( {
            message: 'Post created',
            post: post,
            creator: { _id: creator._id, name: creator.name }
        })
      })
      .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
      });    
    //201=> success & created a resource
    
}

exports.getAPost = (req, res, next) => {
    const postId = req.params.postId;
    PostModel.findById(postId)
        .then( post => {
            if(!post){
                const error = new Error('cant find post');
                error.statusCode = 404;
                throw error;//throw inside then block sent to catch()
            }
            res.status(200).json( {
                message: 'Post fetched',
                post: post
            });
        })
        .catch( err => {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        })
}

/*edit or update post*/
exports.updatePost = (req, res, next) => {
    console.log('inside updatepost')
    //validation error check
    const error = validationResult(req);
    if(!error.isEmpty()){
        const error = new Error('creating post validaion error ');
        error.statusCode = 422;
        throw error;//throw inside then block sent to catch()
    }
    const postId = req.params.postId;
    const title = req.body.title;
    const content = req.body.content;
    let imageUrl  = req.body.image;//in edit mode. old image path received in image variable
    //if old image. then path is send .
    if(req.file){//if new image
        imageUrl = req.file.path.replace('\\','/')
    }
    console.log(`imageUrl = ${imageUrl}`)
     if(!imageUrl){
        const error = new Error('no image path is set');
        error.statusCode = 422;
        throw error;
    } 
    PostModel.findById(postId)
    .then( post => {
        if(!post){
            const error = new Error('cant find post');
            error.statusCode = 404;
            throw error;//throw inside then block sent to catch()
        }
        if(post.creator.toString() !== req.userId){//check for right User
            const error = new Error('Your are not authenticated to edit');
            error.statusCode = 403;
            throw error;
        }
        if(imageUrl !== post.imageUrl ){//need to delete old image

            fileHelper.deletePath(post.imageUrl);
        }
        post.title = title;
        post.content = content;
        post.imageUrl = imageUrl
        return post.save();

    })
    .then(result => {
        res.status(200).json({
            message: 'updated post',
            post: result
        })
    })
    .catch( err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })

}

exports.deletePost = (req, res, next) => {
    const postId = req.params.postId;
    PostModel.findById(postId)
    .then( post => {
        //checked loggedin user
        if(!post){
            const error = new Error('cant find post');
            error.statusCode = 404;
            throw error;//throw inside then block sent to catch()
        }
        if(post.creator.toString() !== req.userId){//check for right User
            const error = new Error('Your are not authenticated to delete');
            error.statusCode = 403;
            throw error;
        }
        fileHelper.deletePath(post.imageUrl);
        return PostModel.findByIdAndDelete(postId)
    })
    .then(result => {
        console.log('post deleted')
        return UserModel.findById(req.userId)
    })
    .then( user => {
        user.posts.pull(postId)//to remove postid from user log
        return user.save()
    })
    .then(result => {
        res.status(200).json({
            message: 'Post deleted',
            //post: result
        })
    })
    .catch( err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    })

}
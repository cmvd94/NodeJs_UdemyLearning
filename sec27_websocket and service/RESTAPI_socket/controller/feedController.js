const {validationResult} = require('express-validator');


const PostModel = require('../model/post');
const UserModel = require('../model/user')
const fileHelper = require('../util/fileHelper')
const io = require('../socket');

///get all posts with pagination logic
exports.getPosts = async (req, res, next) => {
    const currentPage = req.query.page || 1;
    const itemPerPage = 2;
    try{

        const totalItem = await PostModel.find().countDocuments() 
        const posts = await PostModel.find().populate('creator')//pagination logic
        .sort({ createdAt: -1})
        .skip((currentPage-1) * itemPerPage)
        .limit(itemPerPage)
        
        res.status(200).json( {
            message: 'all post fetched',
            posts: posts,//posts key defined in react.
            totalItems: totalItem 
        })    
    } catch(err ) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    };
}

/*single post fields in react title,author,date,image,content*/
//react->sec->pages->feed->singlepost->singlepost.js
exports.createPost = async (req, res, next) => {
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
    try{

        const postCreated = await post.save()
        const user = await UserModel.findById(req.userId);
        user.posts.push(post)//save post id
        await user.save()
        //.emit(channel, {object data to sent})
        //io.getIO().emit('posts', {action: 'create', post: postCreated})
        io.getIO().emit('posts', {action: 'create', post: { ...postCreated._doc, creator: {_id: req.userId, name: user.name}}})
        //201=> success & created a resource
        res.status(201).json( {
            message: 'Post created',
            post: postCreated,
            creator: { _id: user._id, name: user.name }
        }) 
        
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }   
}

/*get a post detail*/
exports.getAPost = async (req, res, next) => {
    const postId = req.params.postId;
    try{
            const post = await PostModel.findById(postId)
            if(!post){
                const error = new Error('cant find post');
                error.statusCode = 404;
                throw error;//throw inside then block sent to catch()
            }

            res.status(200).json( {
                message: 'Post fetched',
                post: post
            });
        }catch( err) {
            if(!err.statusCode){
                err.statusCode = 500;
            }
            next(err);
        }
}

/*edit or update post*/
exports.updatePost = async (req, res, next) => {
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
    console.log('imageUrl')
    console.log(imageUrl);

    if(req.file){//if new image
        imageUrl = req.file.path.replace('\\','/')
    }
    //console.log(`imageUrl = ${imageUrl}`)
     if(!imageUrl){
        const error = new Error('no image path is set');
        error.statusCode = 422;
        throw error;
    } 
    try {
        const post = await PostModel.findById(postId).populate('creator')
        console.log(post)
        if(!post){

            const error = new Error('cant find post');
            error.statusCode = 404;
            throw error;//throw inside then block sent to catch()
        }
        if(post.creator._id.toString() !== req.userId){//check for right User
            const error = new Error('Your are not authenticated to edit');
            error.statusCode = 403;
            throw error;
        };
        //this is complicated bcz of frontend code error
        if (imageUrl !== 'undefined' && imageUrl !== post.imageUrl) {
            if(post.imageUrl !== 'undefined'){
                clearImage(post.imageUrl);
            }
            post.imageUrl = imageUrl;
        }
        post.title = title;
        post.content = content;
       // post.imageUrl = imageUrl
        const result = await post.save();
        io.getIO().emit('posts', {action: 'update', post: result})
        res.status(200).json({
            message: 'updated post',
            post: result
        })
    }catch ( err ) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}

exports.deletePost = async (req, res, next) => {
    const postId = req.params.postId;
    try{
        const post = await PostModel.findById(postId)
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
        await PostModel.findByIdAndDelete(postId)
        const user = await UserModel.findById(req.userId)
        user.posts.pull(postId)//to remove postid from user log
        await user.save()
        io.getIO().emit('posts',{action: 'delete', post: postId})
        res.status(200).json({
                message: 'Post deleted',
                //post: result
            })
    }catch( err ) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
    }

}
/*resolver communicate with db */
const bcrypt = require("bcryptjs");
const validator = require("validator");
const jwt = require("jsonwebtoken");


const { deletePath } = require("../util/fileHelper");
const UserModel = require("../model/user");
const PostModel = require("../model/post");
module.exports = {
  //args obj which has all arugmenst passed through the function.in our case it one
  createUser: async function ({ userInput }, { req }) {
    //return UserModel.findOne().then().catch() if thenable then return must in resolver bcz graphql does not wait to resolve
    //but in async await it automatically return , we dont see the return statement here but it is there.

    /*input validation*/
    const error = [];
    if (!validator.isEmail(userInput.email)) {
      error.push({ message: "email is invalid" });
    }
    if (
      validator.isEmpty(userInput.password) ||
      !validator.isLength(userInput.password, { min: 5 })
    ) {
      error.push({ message: "password too short" });
    }
    if (error.length > 0) {
      const err = new Error("Invalid input");
      err.data = error;
      err.code = 422;
      throw err;
    }
    console.log(userInput);
    const existingUser = await UserModel.findOne({ email: userInput.email });
    if (existingUser) {
      console.log(existingUser);
      const error = new Error("Email ID already registered");
      throw error;
    }
    const hashedPassword = await bcrypt.hash(userInput.password, 12);
    const user = new UserModel({
      email: userInput.email,
      name: userInput.name,
      password: hashedPassword,
    });
    const createdUser = await user.save();
    return { ...createdUser._doc, _id: createdUser._id.toString() };
    //overwriting _id field, it is Obj.ID. which graphql does not know
  },

  login: async function ({ email, password }) {
    //console.log('inside login')
    const user = await UserModel.findOne({ email: email });
    if (!user) {
      const err = new Error("User not found");
      err.code = 401;
      throw err;
    }
    //console.log(user, email, password);
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const err = new Error("Password is incorrect");
      err.code = 401;
      throw err;
    }
    //console.log(isEqual);
    const token = jwt.sign(
      {
        //data which we want to send(optional)
        userId: user._id.toString(),
        email: user.email,
      },
      "this is secret token string to be encoded next field is expiing time",
      { expiresIn: "1h" }
    );
    //console.log(token);
    return { token: token, userId: user._id.toString() };
  },

  /*creating post  */ 
  createPost: async function ({ postInput }, { req }) {
    /*checking auth true or false set in app.js */
    console.log("inside createpost");
    console.log(`isauth ${req.isAuth}`);
    if (!req.isAuth) {
      const error = new Error("not Authenticated");
      error.code = 401;
      throw error;
    }
    //console.log(postInput.title)
    const error = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      error.push({ message: "title is invalid" });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      error.push({ message: "content is invalid" });
    }
    if (error.length > 0) {
      const err = new Error("Invalid input");
      err.data = error;
      err.code = 422;
      throw err;
    }
    const user = await UserModel.findById(req.userId);
    if (!user) {
      const err = new Error("User not found");
      err.code = 401;
      throw err;
    }
    const post = new PostModel({
      title: postInput.title,
      content: postInput.content,
      imageUrl: postInput.imageUrl,
      creator: user,
    });
    const createdPost = await post.save();
    user.posts.push(createdPost);
    await user.save();
    console.log(createdPost);
    return {
      ...createdPost._doc,
      _id: createdPost._id.toString(),
      createdAt: createdPost.createdAt.toISOString(),
      updatedAt: createdPost.updatedAt.toISOString(),
    };
  },

  /*fetch post based on page number*/
  getAllPosts: async function ({ page }, { req }) {
    console.log("inside getallposts");
    if (!req.isAuth) {
      const error = new Error("not Authenticated");
      error.code = 401;
      throw error;
    }
    if (!page) {
      page = 1;
    }
    const perPage = 2;

    const totalPosts = await PostModel.find().countDocuments();
    const posts = await PostModel.find()
      .sort({ createdAt: -1 })
      .skip((page - 1) * perPage)
      .limit(perPage)
      .populate("creator");

    //console.log(posts)
    return {
      posts: posts.map((p) => {
        return {
          ...p._doc,
          _id: p._id.toString(),
          createdAt: p.createdAt.toISOString(),
          updatedAt: p.updatedAt.toISOString(),
        };
      }),
      totalPosts: totalPosts,
    };
  },

  getAPost: async function ({ id }, { req }) {
    console.log("inside get a posts");
    if (!req.isAuth) {
      const error = new Error("not Authenticated");
      error.code = 401;
      throw error;
    }
    const post = await PostModel.findById(id).populate("creator");
    if (!post) {
      const err = new Error("no post found");
      err.code = 404;
      throw err;
    }
    return {
      ...post._doc,
      _id: post._id.toString(),
      createdAt: post.createdAt.toISOString(),
      updatedAt: post.updatedAt.toISOString(),
    };
  },
  /*edit/update post*/
  updatePost: async function ({ id, postInput }, { req }) {
    console.log("inside update post");
    if (!req.isAuth) {
      const error = new Error("not Authenticated");
      error.code = 401;
      throw error;
    }
    const post = await PostModel.findById(id).populate("creator");
    if (!post) {
      const err = new Error("no post found");
      err.code = 404;
      throw err;
    }
    if (post.creator._id.toString() !== req.userId.toString()) {
      const err = new Error("no post found");
      err.code = 403;
      throw err;
    }
    const error = [];
    if (
      validator.isEmpty(postInput.title) ||
      !validator.isLength(postInput.title, { min: 5 })
    ) {
      error.push({ message: "title is invalid" });
    }
    if (
      validator.isEmpty(postInput.content) ||
      !validator.isLength(postInput.content, { min: 5 })
    ) {
      error.push({ message: "content is invalid" });
    }
    if (error.length > 0) {
      const err = new Error("Invalid input");
      err.data = error;
      err.code = 422;
      throw err;
    }
    post.title = postInput.title;
    post.content = postInput.content;
    if (postInput.imageUrl !== "undefined") {
      post.imageUrl = postInput.imageUrl;
    } //deleting post is done in app.js middleware
    const updatePost = await post.save();
    return {
      ...updatePost._doc,
      _id: updatePost._id.toString(),
      createdAt: updatePost.createdAt.toISOString(),
      updatedAt: updatePost.updatedAt.toISOString(),
    };
  },

  deletePost: async function ({ id }, { req }) {
    console.log("inside delete");
    if (!req.isAuth) {
      const error = new Error("not Authenticated");
      error.code = 401;
      throw error;
    }
    const post = await PostModel.findById(id);
    if (!post) {
      const err = new Error("no post found");
      err.code = 404;
      throw err;
    } //we didnt populate.so creator.toString()
    if (post.creator.toString() !== req.userId.toString()) {
      const err = new Error("no post found");
      err.code = 403;
      throw err;
    }
    deletePath(post.imageUrl);
    await PostModel.findByIdAndDelete(id);
    const user = await UserModel.findById(req.userId);
    user.posts.pull(id);
    await user.save();
    return true;
  },
  userStatus: async function (args, { req }) {
    console.log("inside UserStatus");
    if (!req.isAuth) {
      const error = new Error("not Authenticated");
      error.code = 401;
      throw error;
    }
    const user = await UserModel.findById(req.userId);
    if (!user) {
      const err = new Error("no user found");
      err.code = 404;
      throw err;
    }
   //console.log({ ...user._doc, _id: user._id.toString() })
    return { ...user._doc, _id: user._id.toString() };
  },

  updateStatus: async function( {status}, {req}){
    console.log("inside UpdateStatus");
    if (!req.isAuth) {
      const error = new Error("not Authenticated");
      error.code = 401;
      throw error;
    }
    const user = await UserModel.findById(req.userId);
    if (!user) {
      const err = new Error("no user found");
      err.code = 404;
      throw err;
    }
    user.status = status;
    await user.save();
    return { ...user._doc, _id: user._id.toString() };
  }
};

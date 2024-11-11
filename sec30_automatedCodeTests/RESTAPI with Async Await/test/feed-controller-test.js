const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const UserModel = require("../model/user");
const PostModel = require('../model/post');
const authContoller = require("../controller/authController");
const feedController = require('../controller/feedController')


const MONGODB_URI =
  "mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/testingDB?retryWrites=true&w=majority&appName=Cluster0";

  describe("FEED CONTROLLER - WITH DATABASE", function () {
    before(function (done) {
      mongoose
        .connect(MONGODB_URI)
        .then((result) => {
          console.log("CONNECTED TO MONGODB via MONGOOSE");
          const user = new UserModel({
            email: "vis@gmail.com",
            password: "password",
            name: "vishnu",
            posts: [],
            _id: "66bf9622b56308df91c7d823",
          });
          return user.save();
        })
        .then(() => {
          done();
        });
    });
  
    it("post created and added in user.creator .", function (done) {
      const req = {
        body: {
            title: 'test post',
            content: ' a test post',
        },
        file: {
            path: 'filepath'
        },
        userId: "66bf9622b56308df91c7d823",
      };
      //if any doubt .in chatgpt just check res structure
      const res = {
        statusCode: 500,
        userStatus: null,
        status: function (code) {
          this.statusCode = code;
          return this;
        },
        json: function (data) {
         
        },
      };
      feedController.createPost(req, res, () => {})
        .then((savedUser) => {// modified in feedcontroller to return usersaved
          expect(savedUser).to.have.property('posts');
          expect(savedUser.posts).to.have.length(1);
        })
        .then (()=> {
          done();
        })
    });
  
    after(function (done) {
      UserModel.deleteMany({})
        .then(() => {
          return mongoose.disconnect();
        })
        .then(() => {
          done();
        });
    });
  });
  
const { expect } = require("chai");
const sinon = require("sinon");
const mongoose = require("mongoose");

const UserModel = require("../model/user");
const authContoller = require("../controller/authController");
const { json } = require("body-parser");

const MONGODB_URI =
  "mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/testingDB?retryWrites=true&w=majority&appName=Cluster0";
/* 
// preventing real database - stub database
describe("AUTH CONTROLLER - LOGIN - WITHOUT DATABASE", function () {
  it("it should throw error 500 if accessing the DB fails", function (done) {
    sinon.stub(UserModel, "findOne");
    UserModel.findOne.throws(); // forcing it to throw error

    const req = {
      body: {
        email: "vishnudassonyz2@gmail.com",
        password: "password",
      },
    };

    authContoller
      .login(req, {}, () => {})
      .then((result) => {
        expect(result).to.be.an("error"); //chai can detect couple of type of data.(string, obj, null, error etc)
        expect(result).to.have.property("statusCode", 500); //
        done();
      });
      // return statement should be placed in controller
    UserModel.findOne.restore();
  });
});

//connecting with DB
//use different db . do not conflict production db
describe("AUTH CONTROLLER -WITH DATABASE", function () {
  it("should send a response with valid user status for an existing user", function (done) {
    mongoose
      .connect(MONGODB_URI)
      .then((result) => {
        console.log("CONNECTED TO MONGODB via MONGOOSE");
        const user = new UserModel( {
            email: 'vis@gmail.com',
            password: 'password',
            name: 'vishnu',
            posts: [],
            _id: '66bf9622b56308df91c7d823'
        })
        return user.save();
      })
      .then( () => {
        const req = {
            userId: '66bf9622b56308df91c7d823'
        }
        //if any doubt .in chatgpt just check res structure
        const res = {
            statusCode :500,
            userStatus: null,
            status: function(code){
                this.statusCode = code;
                return this;
            },
            json: function(data){
                this.userStatus = data.status
            }
        };
        authContoller.getUserStatus(req, res, ()=> {}).then( ()=> {
            expect(res.statusCode).to.be.equal(200);
            expect(res.userStatus).to.be.equal('I am New');
            UserModel.deleteMany({})
              .then( () => {
                return mongoose.disconnect();
              })
              .then(()=> {
                done();
              })
            //done();
        });
      })
      .catch((err) => console.log(err));
  });
});
 */

//using before and after
describe("AUTH CONTROLLER -WITH DATABASE", function () {
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

  it("should send a response with valid user status for an existing user", function (done) {
    const req = {
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
        this.userStatus = data.status;
      },
    };
    authContoller
      .getUserStatus(req, res, () => {})
      .then(() => {
        expect(res.statusCode).to.be.equal(200);
        expect(res.userStatus).to.be.equal("I am New");
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

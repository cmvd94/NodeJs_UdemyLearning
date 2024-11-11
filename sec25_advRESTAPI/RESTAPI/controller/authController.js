const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../model/user');

/* create user SIGNUP*/
exports.signup = (req, res, next) => {
    //console.log(req.body.email,req.body.password,req.body.name)
    const error = validationResult(req);
    if(!error.isEmpty()){
        //console.log(error);
        const err = new Error(`creating user validaion error : ${error.msg} `);
        err.statusCode = 422;
        //error.data = error.array()[0]
        throw err;//throw inside then block sent to catch()
    }
    console.log('inside signup')
    const email = req.body.email;
    const name = req.body.name;
    const password = req.body.password;
    bcrypt.hash(password, 12)
      .then( hashpassword => {
        const createUser = new UserModel( {
            email: email,
            password: hashpassword,
            name: name
        })
        return createUser.save()
      })
      .then(result => {
        res.status(201).json({
            message: 'user created',
            userId: result._id
        })
      })
      .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
      })
    
}

exports.login = (req, res, next) =>  {
    const email = req.body.email;
    const password = req.body.password;
    let loadUser ;

    UserModel.findOne( {email: email})
      .then( user => {
        if(!user){
            const error = new Error(' Email ID is not found')
            error.statusCode = 401;
            throw error
        }
        loadUser = user;
        return bcrypt.compare(password, user.password)
      })
      .then( booleanResult => {
        if(!booleanResult){
            const error = new Error(' worng password')
            error.statusCode = 401;
            throw error
        }
        const token = jwt.sign({//storing data in token optional
            email: loadUser.email, 
            userId: loadUser._id.toString()
          }, 
          'this is secret token string to be encoded next field is expiing time',
           { expiresIn: '1h'}
        )
        res.status(200).json({ token: token, userId: loadUser._id.toString() })

      })
      .catch(err => {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
      })
    
}

exports.getUserStatus = (req, res, next) => {
  UserModel.findById(req.userId)
    .then( user => {
      if(!user){
        const error = new Error(' Email ID is not found')
        error.statusCode = 404;
        throw error
      }
      return res.status(200).json({ status: user.status})
    })
    .catch(err => {
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
    })
  
}

exports.patchUpdateStatus = (req, res, next) => {

  const updatedStatus = req.body.status;
  UserModel.findById(req.userId)
    .then( user => {
      if(!user){
        const error = new Error(' Email ID is not found')
        error.statusCode = 404;
        throw error
      }
      user.status = updatedStatus;
      return user.save();
    })
    .then( result => {
      return res.status(200).json({message: 'status updated'})
    })
    .catch(err => {
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
    })
  
}

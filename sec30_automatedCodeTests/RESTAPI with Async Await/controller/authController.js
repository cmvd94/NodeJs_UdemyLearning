const { validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const UserModel = require('../model/user');

/* create user SIGNUP*/
exports.signup = async (req, res, next) => {
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
    
    try{

      const hashpassword = await bcrypt.hash(password, 12)
      const createUser = new UserModel( {
        email: email,
        password: hashpassword,
        name: name
      })  
      
      const result = await createUser.save()
      
      res.status(201).json({
        message: 'user created',
        userId: result._id
      })
      
    }catch(err) {
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);
      } 
}

exports.login = async (req, res, next) =>  {
    const email = req.body.email;
    const password = req.body.password;
  
    try{

      const user = await UserModel.findOne( {email: email})
        if(!user){
          const error = new Error(' Email ID is not found')
          error.statusCode = 401;
          throw error
        }

        const booleanResult = await bcrypt.compare(password, user.password)
        if(!booleanResult){
            const error = new Error(' worng password')
            error.statusCode = 401;
            throw error
        }
      const token = jwt.sign({//storing data in token optional
          email: user.email, 
          userId: user._id.toString()
        }, 
        'this is secret token string to be encoded next field is expiing time',
        { expiresIn: '1h'}
      )

      res.status(200).json({ token: token, userId: user._id.toString() })

      return ; //for stub test
      
    }catch(err){
        if(!err.statusCode){
            err.statusCode = 500;
        }
        next(err);

        return err; //for stub test 
      }
    
}

exports.getUserStatus = async (req, res, next) => {
  try{

    const user = await UserModel.findById(req.userId)
      if(!user){
        const error = new Error(' Email ID is not found')
        error.statusCode = 404;
        throw error
      }
      res.status(200).json({ status: user.status})
    }catch(err){
      if(!err.statusCode){
          err.statusCode = 500;
      }
      next(err);
    }
  
}

exports.patchUpdateStatus = async (req, res, next) => {

  const updatedStatus = req.body.status;
  try{

    const user = await UserModel.findById(req.userId)
      if(!user){
        const error = new Error(' Email ID is not found')
        error.statusCode = 404;
        throw error
      }
      user.status = updatedStatus;
      await user.save();
      res.status(200).json({message: 'status updated'})
  
  }catch(err) {
      if(!err.statusCode){
          err.statusCode = 500;
        }
        next(err);
      }
      
    }
    
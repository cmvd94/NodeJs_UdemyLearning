const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    if(!authHeader){
        const error = new Error('not Authenticated')
        error.statusCode = 401;
        throw error;
    }
    const token = authHeader.split(' ')[1];
    let decodedToken
    try{
        //jwt.decode only decode the token but jwt.verify decode the token & verify (token, secret key)
        decodedToken = jwt.verify(token, 'this is secret token string to be encoded next field is expiing time')
    } catch( err) {
        err.statusCode = 500;
        throw err;
    }

    if(!decodedToken){
        const error = new Error('not Authenticated')
        error.statusCode = 401;
        throw error;
    }
    //now decodedToken is a obj which is sent during token creation
    req.userId = decodedToken.userId
    next();

}
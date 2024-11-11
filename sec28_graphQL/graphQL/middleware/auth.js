const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    const authHeader = req.get('Authorization');
    //console.log(authHeader)
    if(!authHeader){
        req.isAuth = false
        return next()
    }
    const token = authHeader.split(' ')[1];
    //console.log(token);
    let decodedToken
    try{
        //jwt.decode only decode the token but jwt.verify decode the token & verify (token, secret key)
        decodedToken = jwt.verify(token, 'this is secret token string to be encoded next field is expiing time')
    } catch( err) {
        req.isAuth = false
        return next()
    }
    //console.log(decodedToken)
    if(!decodedToken){
        req.isAuth = false
        return next()
    }

    //now decodedToken is a obj which is sent during token creation
    req.userId = decodedToken.userId
    req.isAuth = true;
    console.log(`isAuth ${req.isAuth}`);
    next();

}
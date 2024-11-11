/*without login we can access page by searching by its url..
so we have to handle routes ...check get routes of shop and admin*/
module.exports = (req, res, next) => {
    console.log('inside route')
    if(!req.session.isLoggedIn){
        return res.redirect('/login')
    }else{
        console.log('next. isLoggedin true')
        next()
    }
} 
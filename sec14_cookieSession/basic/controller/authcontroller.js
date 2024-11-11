/*login page*/
exports.getLogin = ( req, res, next ) => {
    const isLoggedIn = req.get('Cookie').split('=')[1];
    res.render('auth/login', {
        pageTitle: 'Login',
        path: '/login',
        isAuthenticated: isLoggedIn
        });
}

/*POST after pressing login store in db*/
exports.postLogin = ( req, res, next ) => {
    /*req.isLoggedIn = true;
    //so we have set isAuthenticated for all render call.(ie shop and admin controller)
    //in navigation.ejs .. if authentication is true then admin add-product and list of product will be displayed in navigation bar
    //problem is even when is set isLoggendIn true here and assigning it to all res.sender it wont work
    //bcz each req from user is independent so now we're setiing it to true in current login request.
    //it response send or redirect it will eventually send  a new get request which total independent ,so that set will be expired 
    //check ..setting true . then redirected , we wont get admin navig area*/

    //check inspect->application->cookies.. session when browser closed cookie erased
    res.setHeader('Set-Cookie','LoggedIn = true')
    res.redirect('/');
}
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pageUnmatched = require('./routes/404');
const authRoutes = require('./routes/auth')


const UserModel = require('./model/user');

const MONGODB_URI = 'mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/Authentication?retryWrites=true&w=majority&appName=Cluster0'
const app = express();

const sessionStoreDb = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
    //we also define when should expire, it is cleaned by mongodb
}); 

const csrfProtection = csrf();//can also config.

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));



/*session middleware*/
//session in server and cookie in browser.
app.use(
    session({
        secret: 'this will encrypt cookie and send res wecan have anythink here but should be long value. resave false session will not saved on every request ,but only if anything changes in session. saveUninitialized ensure that no session get saved for a request .we can also configure session cookie by cookie: { maxAge: }',
        resave: false,
        saveUninitialized: false,
        store: sessionStoreDb,
        /*cookie: {we can added cookie related config here }
        //orelse it will take default... so session automatically create cookie and reads*/
    
        //when post login session and cookie is created. so we can set Authentication details in postlogin
    })
);

/*csrf middle should be after session initial..session is used */
app.use(csrfProtection);
app.use(flash());

app.use((req, res, next) => {
    console.log('requested URL');
    console.log(req.method, req.url);    
    next();
})

/*once session is created. req.user is assigned with user*/
app.use((req, res, next) => {
    if (req.session && req.session.userId) {
        //console.log(req.session.userId)
      UserModel.findById(req.session.userId)
        .then( user => {
        if (user) {
          req.user = user;
          //console.log('req.user = user')
          next();
        } else {
            //console.log('flase---------req.user = user')
          next(new Error('Could not restore User from Session.'));
        }
      });
    } else {
        //console.log('flase---------')
      next();
    }
});


/*available for every render view*/
app.use( (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(pageUnmatched);



mongoose
    .connect(
        MONGODB_URI
    )
    .then( (result) => {
        console.log('Mongoose connected!!');
        app.listen(3000,console.log('server is listening on PORT 3000'));
    })
    .catch(err => console.error(err));



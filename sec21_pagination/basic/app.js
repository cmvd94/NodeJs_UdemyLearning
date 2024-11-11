const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const session = require('express-session')
const MongoDBStore = require('connect-mongodb-session')(session);
const csrf = require('csurf');
const flash = require('connect-flash');
const multer = require('multer');//for parsing file/image 

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pageUnmatched = require('./routes/error');
const authRoutes = require('./routes/auth')


const UserModel = require('./model/user');

const MONGODB_URI = 'mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/fileUPOWN?retryWrites=true&w=majority&appName=Cluster0'
const app = express();

const sessionStoreDb = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
    //we also define when should expire, it is cleaned by mongodb
}); 

/*disk storage is storage engine , can pass js obj to config*/
/*destination and filename are function... then multer will call fo incoming file.
these func control how the file handled and place to store and naming*/
const fileStorage = multer.diskStorage( {
  destination: (req, file, callback) => {
    /*1st argument null , we can throw error message to inform multer , that something wrong incoming file then it will not store it,
    if null , then multer will store it.... 2nd argument is where to store it*/
    callback(null,'image');
  },//file is data about that obj
  filename: (req, file, callback) => {
    console.log(Date.now())
    callback(null, Date.now().toString() + '-' + file.originalname)
  }//2nd file name
})

const fileFilter = (req, file, callback) =>{
  if(
    file.mimetype === 'image/png' || 
    file.mimetype === 'image/jpg' ||
    file.mimetype === 'image/jpeg' 
  ){ 
    callback(null, true);//save this extension file only. other imgae format or any  other file(eg pdf) wont save
  }else{
    callback(null, false);
  }
}

const csrfProtection = csrf();//can also config.//work for post method

app.set('view engine', 'ejs');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: false }));//urlencoded data is just text data
app.use(multer( {storage: fileStorage, fileFilter: fileFilter} ).single('image'));// can set single or multiple. then image used in ejs to get parsed
app.use(express.static(path.join(__dirname, 'public')));
app.use('/image',express.static(path.join(__dirname, 'image')));


app.use((req, res, next) => {
  console.log('requested URL');
  console.log(req.method, req.url);    
  next();
})

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

  /*csrf middle should be after session initial..session is used 
  csrf set for all page*/
app.use((req, res, next) => {
  csrfProtection(req, res, err => {
    if(err){
        return res.redirect('/login')
    }else{
        next();
    }
  })    
});
/* 
app.use((req, res, next) => {
  console.log('after csurf')
  next()
})
 */
app.use(flash());
    
/*available for every render view*/
app.use( (req, res, next) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  res.locals.csrfToken = req.csrfToken();
  next();
})

/* 
app.use((req, res, next) => {
  console.log('after token')
  next()
})
 */

/*once session is created. req.user is assigned with user*/
app.use((req, res, next) => {
  if (req.session && req.session.userId) {
    console.log('inside req.user middleware')
    UserModel.findById(req.session.userId)
    .then( user => {
        console.log('inside req.user middleware then')
        if (user) {
            console.log('inside req.user middleware req.use = user')
            req.user = user;
            next();
          } else {
            console.log('inside req.user middleware req.use !!!=== user')
            console.log(req.session, req.session.userId)
            return req.session.destroy( err => {
              if(err){
                  const error = new Error('Could not restore User from Session.');
                  return next(error)  
              }else{
                res.redirect('/')
              }
            }) 
          }
        })
        .catch(err => {
          next(new Error(err))
        })
  } else {
    if(req.session.userId){
      req.session = undefined
      req.session.userId = undefined;
      return res.redirect('/login');
    }
      next();
  }
});

/* 
app.use((req, res, next) => {
  console.log('now route')
  next()
})
 */
app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(pageUnmatched);

/*error handling middleware...if got more error handling middleware. then it work from top to bottom*/
app.use((error, req, res, next) => {
  res.redirect('/500');
  /* res.status(500).render('error/500', { 
    pageTitle: 'SERVER ERROR',
    path: '/500'
  }); */
})

mongoose
    .connect(
        MONGODB_URI
    )
    .then( (result) => {
        console.log('Mongoose connected!!');
        app.listen(3000,console.log('server is listening on PORT 3000'));
    })
    .catch(err => console.error(err));



const express = require('express')
const bodyParse = require('body-parser');
const mongoose = require('mongoose')
const path = require('path');
const multer = require('multer');
const {v4: uuid} = require('uuid')
const cors = require('cors')

const feedRoutes = require('./route/feed');
const authRoutes = require('./route/auth');

const MONGODB_URI = 'mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/RESTAPI?retryWrites=true&w=majority&appName=Cluster0'

const app = express();

const fileStorage = multer.diskStorage({
    destination: (req, file, callback) => {
        callback(null, 'images')
    },
    filename: (req, file, callback) => {
        callback(null, uuid() + '-' + file.originalname)
        //callback(null, uuid());
    }
});

const fileFilter = (req, file, callback) => {
    if(file.mimetype === 'image/png' || file.mimetype === 'image/jpg' || file.mimetype === 'image/jpeg'){
        callback(null, true);
    }else{
        callback(null, false);
    }
}

app.use((req, res, next) => {
    console.log(req.url,req.method)
    next()
})

//app.use(bodyParse.urlencoded())// for x-ww-form-urlencoded
app.use(bodyParse.json()); //for application/json
app.use(multer( {storage: fileStorage, fileFilter: fileFilter}).single('image'));
app.use('/images',express.static(path.join(__dirname,'images')));

/* 
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');//access to all client
    res.setHeader('Access-Control-Allow-Method', 'GET', 'POST', 'PUT', 'PATCH', 'DELETE');//we can allow whatever we want too
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');//we can alose set wildcard '*'
    next()
})
 */
app.use(cors())

app.use('/feed',feedRoutes);
app.use('/auth',authRoutes);

/*error handling*/
app.use((error, req, res, next) => {
    console.log(error);
    const status = error.statusCode || 500;
    const message = error.message;
    const data = error.data;
    res.status(status).json( {
        message: message,
       // data: data//optional
    });

})

mongoose.connect( MONGODB_URI)
.then( () => {
    console.log('CONNECTED TO MONGODB via MONGOOSE')
    app.listen(8080,console.log("api server running on PORT 8080"));
})
.catch(err => console.log(err));
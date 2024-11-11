const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pageUnmatched = require('./routes/404');


const UserModel = require('./model/user');

 
app.use( (req, res, next) => {
    UserModel.findById('66b1e456317320458a142ab2')
    .then( user => {
        //req.user = new UserModel(user.username, user.email, user.cart, user._id);//if we assign like this it has only object with value. but it doesnt not have method(ie findbyid etc) so that we can do operation. bcz its fetched data from db
        req.user = user;// since it is mongoose model. no need to create obj again
        next()
    })
    .catch(err => console.error(err));
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log('requested URL');
    console.log(req.method, req.url);    
    next();
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pageUnmatched);

mongoose
    .connect('mongodb+srv://Nodejs:Nodejspassword@cluster0.rj3wp52.mongodb.net/testMongoose?retryWrites=true&w=majority&appName=Cluster0')
    .then( (result) => {
        console.log('Mongoose connected!!');
        UserModel.findOne()
        .then( user => {
            if(!user){
                const userCreate = new UserModel( {
                    name: 'das',
                    email: 'das@gmal.com',
                    cart: {
                        items: []
                    }
                });
                userCreate.save();

            }
        })
        
        app.listen(3000,console.log('server is listening on PORT 3000'));
    })
    .catch(err => console.error(err));



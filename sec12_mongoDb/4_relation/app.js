const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pageUnmatched = require('./routes/404');

const { mongoConnect } = require('./util/database');

const UserModel = require('./model/user');


app.use( (req, res, next) => {
    UserModel.findById('66afeacee9a71b713a6a6812')
    .then( user => {
        req.user = new UserModel(user.username, user.email, user.cart, user._id);//if we assign like this it has only object with value. but it doesnt not have method(ie findbyid etc) so that we can do operation. bcz its fetched data from db
        next()
    })
    .catch(err => console.error(err));
})


app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
/*
app.use((req, res, next) => {
    console.log('requested URL');
    console.log(req.method, req.url);
    
    next();
})
*/
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pageUnmatched);


mongoConnect( () => {
    app.listen(3000, console.log(`server is running on PORT:3000`)) 
})


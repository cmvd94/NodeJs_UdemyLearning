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

/* 
app.use( (req, res, next) => {
    UserModel.findByPk(1)
    .then( user => {
        req.user = user;
        next()
    })
    .catch(err => console.error(err));
})
 */

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use((req, res, next) => {
    console.log('requested URL')
    console.log(req.method, req.url);
    next();
})
app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pageUnmatched);


mongoConnect( () => {
    app.listen(3000, console.log(`server is running on PORT:3000`)) 
})


const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();
//we have inform express that we're using express-template
//so informing express with app.set 'view engine' -template syntax
app.set('view engine', 'pug');
//we have to inform where html is, which is be templated
//1st "views" is syntax and 2nd one is our folder
app.set('views', 'views');

const adminData = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(bodyParser.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.routes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);

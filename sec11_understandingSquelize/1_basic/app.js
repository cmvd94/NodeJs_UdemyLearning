const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine', 'ejs');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const pageUnmatched = require('./routes/404');

const sequelize = require('./util/database');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(pageUnmatched);


/*it sync model in database by creating the appropriate table*/
sequelize.sync()
.then(result => {
    //console.log(result);
    app.listen(3000);
    //once Database is created .application start listening
})
.catch(err => {
    console.error(err);
})
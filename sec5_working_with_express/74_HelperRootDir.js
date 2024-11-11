const path = require('path');

console.log(require('./util/path'))

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const adminRoutes = require('./routes/74_admin');
const shopRoutes = require('./routes/74_shop');

app.use(bodyParser.urlencoded({extended: false}));

//sec_76: 
app.use(express.static(path.join(__dirname,'public')));

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use((req, res, next) => {
    res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(3000);
